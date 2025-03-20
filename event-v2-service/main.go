package main

import (
	"encoding/json"
	"log"
	"net/http"
	"os"
)

type Response struct {
	Message string `json:"message"`
	Service string `json:"service"`
	Version string `json:"version"`
}

func main() {
	port := os.Getenv("PORT")
	if port == "" {
		port = "3003"
	}

	// Register route handlers
	http.HandleFunc("/health", healthHandler)
	http.HandleFunc("/api/v2/events/email", eventHandler("email"))
	http.HandleFunc("/api/v2/events/payment", eventHandler("payment"))
	http.HandleFunc("/api/v2/events/inventory", eventHandler("inventory"))

	log.Printf("Starting Event V2 Service on port %s", port)
	if err := http.ListenAndServe(":"+port, nil); err != nil {
		log.Fatalf("Could not start server: %s", err.Error())
	}
}

func healthHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	response := Response{
		Message: "OK",
		Service: "event-v2-service",
		Version: "2.0.0",
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(response)
}

// Factory function to create event handlers
func eventHandler(eventType string) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodPost {
			http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
			return
		}

		log.Printf("%s event received", eventType)
		// TODO: Add RabbitMQ publishing logic

		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusAccepted)
		json.NewEncoder(w).Encode(map[string]string{
			"status": eventType + " event received",
		})
	}
}
