package handlers

import (
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/h0rck/event-driven/event-v2-service/models"
)

// @Summary Process payment event
// @Description Process payment event
// @Tags events
// @Accept json
// @Produce json
// @Param event body models.PaymentEvent true "Payment Event"
// @Success 202 {object} map[string]string "Success response"
// @Failure 400 {object} map[string]string "Bad request"
// @Router /api/v2/events/payment [post]
func PaymentHandler(c *gin.Context) {
	var event models.PaymentEvent
	if err := c.ShouldBindJSON(&event); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	log.Printf("Payment event received: OrderID=%s, Amount=%.2f", event.OrderID, event.Amount)
	c.JSON(http.StatusAccepted, gin.H{"status": "payment event processed successfully"})
}
