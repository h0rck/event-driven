package handlers

import (
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/h0rck/event-driven/event-v2-service/models"
)

// @Summary Process inventory event
// @Description Process inventory event
// @Tags events
// @Accept json
// @Produce json
// @Param event body models.InventoryEvent true "Inventory Event"
// @Success 202 {object} map[string]string "Success response"
// @Failure 400 {object} map[string]string "Bad request"
// @Router /api/v2/events/inventory [post]
func InventoryHandler(c *gin.Context) {
	var event models.InventoryEvent
	if err := c.ShouldBindJSON(&event); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	log.Printf("Inventory event received: ProductID=%s, Quantity=%d", event.ProductID, event.Quantity)
	c.JSON(http.StatusAccepted, gin.H{"status": "inventory event processed successfully"})
}
