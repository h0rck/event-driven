package rabbitmq

import "github.com/streadway/amqp"

var channel *amqp.Channel
var connection *amqp.Connection

func Init() error {
	conn, err := amqp.Dial("amqp://guest:guest@localhost:5672/")
	if err != nil {
		return err
	}

	ch, err := conn.Channel()
	if err != nil {
		return err
	}

	// Declara a fila de email
	_, err = ch.QueueDeclare(
		"email_queue", // name
		true,          // durable
		false,         // delete when unused
		false,         // exclusive
		false,         // no-wait
		nil,           // arguments
	)
	if err != nil {
		return err
	}

	channel = ch
	connection = conn
	return nil
}

func PublishMessage(queue string, body []byte) error {
	return channel.Publish(
		"",    // exchange
		queue, // routing key
		false, // mandatory
		false, // immediate
		amqp.Publishing{
			ContentType: "application/json",
			Body:        body,
		})
}

func Close() {
	if channel != nil {
		channel.Close()
	}
	if connection != nil {
		connection.Close()
	}
}
