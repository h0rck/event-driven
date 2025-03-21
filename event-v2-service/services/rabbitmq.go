package services

import (
	"log"

	"github.com/streadway/amqp"
)

type RabbitMQService struct {
	Connection *amqp.Connection
	Channel    *amqp.Channel
	QueueName  string
}

func NewRabbitMQService(queueName string) (*RabbitMQService, error) {
	conn, err := amqp.Dial("amqp://guest:guest@localhost:5672/")
	if err != nil {
		log.Fatalf("Falha ao conectar ao RabbitMQ: %v", err)
		return nil, err
	}

	ch, err := conn.Channel()
	if err != nil {
		log.Fatalf("Falha ao abrir um canal: %v", err)
		return nil, err
	}

	_, err = ch.QueueDeclare(queueName, false, false, false, false, nil)
	if err != nil {
		log.Fatalf("Falha ao declarar a fila: %v", err)
		return nil, err
	}

	return &RabbitMQService{conn, ch, queueName}, nil
}

func (r *RabbitMQService) Publish(message string) error {
	return r.Channel.Publish("", r.QueueName, false, false, amqp.Publishing{
		ContentType: "text/plain",
		Body:        []byte(message),
	})
}

func (r *RabbitMQService) Close() {
	r.Channel.Close()
	r.Connection.Close()
}
