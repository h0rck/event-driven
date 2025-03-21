package rabbitmq

import (
	"encoding/json"
	"fmt"
	"log"
	"os"
	"time"

	"github.com/streadway/amqp"
)

// RabbitMQ guarda a conexão e o canal
type RabbitMQ struct {
	connection *amqp.Connection
	channel    *amqp.Channel
}

// Instância global do RabbitMQ
var Instance *RabbitMQ

// Init conecta ao RabbitMQ e configura as exchanges e filas
func Init() (*RabbitMQ, error) {
	// Get RabbitMQ URI from environment
	rabbitURI := os.Getenv("RABBITMQ_URI")
	if rabbitURI == "" {
		rabbitURI = "amqp://guest:guest@rabbitmq:5672/"
	}

	// Try to connect with retry
	var conn *amqp.Connection
	var err error

	for i := 0; i < 5; i++ {
		conn, err = amqp.Dial(rabbitURI)
		if err == nil {
			break
		}
		log.Printf("Failed to connect to RabbitMQ, retrying in 5 seconds...")
		time.Sleep(5 * time.Second)
	}

	if err != nil {
		return nil, fmt.Errorf("failed to connect to RabbitMQ after 5 attempts: %v", err)
	}

	ch, err := conn.Channel()
	if err != nil {
		return nil, fmt.Errorf("failed to open channel: %v", err)
	}

	rabbit := &RabbitMQ{
		connection: conn,
		channel:    ch,
	}

	// Configure exchanges and queues
	exchanges := []struct {
		name string
		kind string
	}{
		{name: "events.email", kind: "topic"},
		{name: "events.payment", kind: "topic"},
		{name: "events.inventory", kind: "topic"},
	}

	for _, ex := range exchanges {
		err = ch.ExchangeDeclare(
			ex.name, // name
			ex.kind, // kind
			true,    // durable
			false,   // auto-deleted
			false,   // internal
			false,   // no-wait
			nil,     // arguments
		)
		if err != nil {
			return nil, fmt.Errorf("failed to declare exchange %s: %v", ex.name, err)
		}
		log.Printf("Declared exchange: %s", ex.name)
	}

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
