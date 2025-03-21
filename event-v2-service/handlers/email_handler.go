package handlers

import (
	"encoding/json"
	"log"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/h0rck/event-driven/event-v2-service/rabbitmq"
)

type EmailEvent struct {
	To      string    `json:"to"`
	From    string    `json:"from"`
	Subject string    `json:"subject"`
	Body    string    `json:"body"`
	SendAt  time.Time `json:"send_at"`
}

// @Summary Send random email event
// @Description Sends a random email event to RabbitMQ
// @Tags events
// @Produce json
// @Success 202 {object} map[string]string "Success response"
// @Failure 500 {object} map[string]string "Server error"
// @Router /api/v2/events/email [post]
func EmailHandler(c *gin.Context) {
	// Criar email aleatório
	email := EmailEvent{
		To:      "user@example.com",
		From:    "system@example.com",
		Subject: "Test Email",
		Body:    "This is a test email sent at " + time.Now().String(),
		SendAt:  time.Now(),
	}

	// Converter para JSON
	emailJSON, err := json.Marshal(email)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create email"})
		return
	}

	// Enviar para o RabbitMQ
	err = rabbitmq.PublishMessage("email_queue", emailJSON)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to send email to queue"})
		return
	}

	log.Printf("Random email sent to queue: To=%s, Subject=%s", email.To, email.Subject)
	c.JSON(http.StatusAccepted, gin.H{
		"status": "email event sent to queue successfully",
		"email":  email,
	})
}
