package models

import "time"

// EmailEvent representa a estrutura de um evento de email
type EmailEvent struct {
	To      string    `json:"to"`
	From    string    `json:"from"`
	Subject string    `json:"subject"`
	Body    string    `json:"body"`
	SendAt  time.Time `json:"send_at"`
}

// PaymentEvent representa a estrutura de um evento de pagamento
type PaymentEvent struct {
	OrderID     string    `json:"order_id"`
	Amount      float64   `json:"amount"`
	Currency    string    `json:"currency"`
	CustomerID  string    `json:"customer_id"`
	PaymentType string    `json:"payment_type"`
	CreatedAt   time.Time `json:"created_at"`
}

// InventoryEvent representa a estrutura de um evento de inventário
type InventoryEvent struct {
	ProductID   string    `json:"product_id"`
	Quantity    int       `json:"quantity"`
	Operation   string    `json:"operation"` // "add" ou "remove"
	WarehouseID string    `json:"warehouse_id"`
	UpdatedAt   time.Time `json:"updated_at"`
}
