package main

import (
	"log"
	"os"

	"github.com/gin-gonic/gin"
	swaggerFiles "github.com/swaggo/files"
	ginSwagger "github.com/swaggo/gin-swagger"

	_ "github.com/h0rck/event-driven/event-v2-service/docs"
	"github.com/h0rck/event-driven/event-v2-service/handlers"
	"github.com/h0rck/event-driven/event-v2-service/rabbitmq"
)

// @title Event V2 Service API
// @version 2.0.0
// @description This is a sample event service API
// @host localhost:3003
// @BasePath /api/v2

type Response struct {
	Message string `json:"message"`
	Service string `json:"service"`
	Version string `json:"version"`
}

func main() {
	// Inicializa RabbitMQ
	_, err := rabbitmq.Init()
	if err != nil {
		log.Fatalf("Falha ao inicializar RabbitMQ: %v", err)
	}
	defer rabbitmq.Instance.Close()

	// Cria router do Gin
	r := gin.Default()

	// Configura porta
	port := os.Getenv("PORT")
	if port == "" {
		port = "3003"
	}

	// Grupo de rotas v2
	v2 := r.Group("/api/v2")
	{
		// Rota de health check
		v2.GET("/health", handlers.HealthHandler)

		// Rotas de eventos
		events := v2.Group("/events")
		{
			events.POST("/email", handlers.EmailHandler)
			events.POST("/payment", handlers.PaymentHandler)
			events.POST("/inventory", handlers.InventoryHandler)
		}
	}

	// Rota do Swagger
	r.GET("/swagger/*any", ginSwagger.WrapHandler(swaggerFiles.Handler))

	// Inicia o servidor
	log.Printf("Server starting on port %s", port)
	r.Run(":" + port)
}
