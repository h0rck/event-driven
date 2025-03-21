package handlers

import (
	"encoding/json"
	"fmt"
	"log"
	"math/rand"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/h0rck/event-driven/event-v2-service/rabbitmq"
)

type InventoryEvent struct {
	ProductID   string    `json:"product_id"`
	Quantity    int       `json:"quantity"`
	Operation   string    `json:"operation"`
	WarehouseID string    `json:"warehouse_id"`
	UpdatedAt   time.Time `json:"updated_at"`
}

// @Summary Send random inventory event
// @Description Sends a random inventory event to RabbitMQ
// @Tags events
// @Produce json
// @Success 202 {object} map[string]string "Success response"
// @Failure 500 {object} map[string]string "Server error"
// @Router /api/v2/events/inventory [post]
func InventoryHandler(c *gin.Context) {
	// Criar evento de inventário aleatório
	operations := []string{"add", "remove"}
	inventory := InventoryEvent{
		ProductID:   fmt.Sprintf("PROD-%d", rand.Intn(1000)),
		Quantity:    rand.Intn(100),
		Operation:   operations[rand.Intn(len(operations))],
		WarehouseID: fmt.Sprintf("WH-%d", rand.Intn(5)),
		UpdatedAt:   time.Now(),
	}

	// Converter para JSON
	inventoryJSON, err := json.Marshal(inventory)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create inventory event"})
		return
	}

	// Enviar para o RabbitMQ
	err = rabbitmq.PublishMessage("inventory_queue", inventoryJSON)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to send inventory event to queue"})
		return
	}

	log.Printf("Random inventory event sent to queue: ProductID=%s, Operation=%s, Quantity=%d",
		inventory.ProductID, inventory.Operation, inventory.Quantity)
	c.JSON(http.StatusAccepted, gin.H{
		"status":    "inventory event sent to queue successfully",
		"inventory": inventory,
	})
}
