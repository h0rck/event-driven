package handlers

import (
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/h0rck/event-driven/event-v2-service/models"
)

// @Summary Process email event
// @Description Process email event
// @Tags events
// @Accept json
// @Produce json
// @Param event body models.EmailEvent true "Email Event"
// @Success 202 {object} map[string]string "Success response"
// @Failure 400 {object} map[string]string "Bad request"
// @Router /api/v2/events/email [post]
func EmailHandler(c *gin.Context) {
	var event models.EmailEvent
	if err := c.ShouldBindJSON(&event); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	log.Printf("Email event received: To=%s, Subject=%s", event.To, event.Subject)
	c.JSON(http.StatusAccepted, gin.H{"status": "email event processed successfully"})
}
