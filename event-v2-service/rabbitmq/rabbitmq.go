package rabbitmq

import (
	"encoding/json"
	"fmt"
	"log"

	"github.com/streadway/amqp"
)

// RabbitMQ guarda a conexão e o canal
type RabbitMQ struct {
	connection *amqp.Connection
	channel    *amqp.Channel
}

// Instância global do RabbitMQ
var Instance *RabbitMQ

// Configuração das exchanges e filas
var configs = []struct {
	Exchange string
	Queue    string
}{
	{Exchange: "events.email", Queue: "email_queue"},
	{Exchange: "events.payment", Queue: "payment_queue"},
	{Exchange: "events.inventory", Queue: "inventory_queue"},
}

// Init conecta ao RabbitMQ e configura as exchanges e filas
func Init() (*RabbitMQ, error) {
	// Conecta ao RabbitMQ
	conn, err := amqp.Dial("amqp://guest:guest@localhost:5672/")
	if err != nil {
		return nil, fmt.Errorf("erro ao conectar ao RabbitMQ: %v", err)
	}

	// Cria um canal
	ch, err := conn.Channel()
	if err != nil {
		return nil, fmt.Errorf("erro ao criar canal: %v", err)
	}

	rabbit := &RabbitMQ{
		connection: conn,
		channel:    ch,
	}

	// Configura exchanges e filas
	for _, config := range configs {
		// Cria exchange
		err = ch.ExchangeDeclare(
			config.Exchange, // nome
			"topic",         // tipo
			true,            // durável
			false,           // auto-delete
			false,           // internal
			false,           // no-wait
			nil,             // arguments
		)
		if err != nil {
			return nil, fmt.Errorf("erro ao criar exchange %s: %v", config.Exchange, err)
		}

		// Cria fila
		_, err = ch.QueueDeclare(
			config.Queue, // nome
			true,         // durável
			false,        // auto-delete
			false,        // exclusive
			false,        // no-wait
			nil,          // arguments
		)
		if err != nil {
			return nil, fmt.Errorf("erro ao criar fila %s: %v", config.Queue, err)
		}

		// Liga exchange com fila
		err = ch.QueueBind(
			config.Queue,    // fila
			"#",             // routing key
			config.Exchange, // exchange
			false,           // no-wait
			nil,             // arguments
		)
		if err != nil {
			return nil, fmt.Errorf("erro ao ligar exchange com fila: %v", err)
		}

		log.Printf("Configurado: %s -> %s", config.Exchange, config.Queue)
	}

	log.Println("RabbitMQ conectado e configurado com sucesso!")

	Instance = rabbit
	return rabbit, nil
}

// PublishMessage publica uma mensagem em uma exchange
func (r *RabbitMQ) PublishMessage(exchange string, message interface{}) error {
	// Converte mensagem para JSON
	body, err := json.Marshal(message)
	if err != nil {
		return fmt.Errorf("erro ao converter mensagem para JSON: %v", err)
	}

	// Publica a mensagem
	err = r.channel.Publish(
		exchange, // exchange
		"",       // routing key
		false,    // mandatory
		false,    // immediate
		amqp.Publishing{
			ContentType: "application/json",
			Body:        body,
		},
	)
	if err != nil {
		return fmt.Errorf("erro ao publicar mensagem: %v", err)
	}

	log.Printf("Mensagem enviada para %s", exchange)
	return nil
}

// Close fecha a conexão com o RabbitMQ
func (r *RabbitMQ) Close() {
	if r.channel != nil {
		r.channel.Close()
	}
	if r.connection != nil {
		r.connection.Close()
	}
	log.Println("Conexão com RabbitMQ fechada")
}
