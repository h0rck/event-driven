package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

type Response struct {
	Message string `json:"message"`
	Service string `json:"service"`
	Version string `json:"version"`
}

// @Summary Health check endpoint
// @Description Get service health status
// @Tags health
// @Produce json
// @Success 200 {object} Response
// @Router /api/v2/health [get]
func HealthHandler(c *gin.Context) {
	c.JSON(http.StatusOK, Response{
		Message: "OK",
		Service: "event-v2-service",
		Version: "2.0.0",
	})
}
