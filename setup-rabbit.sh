# setup_rabbitmq.sh
# Shell script to declare RabbitMQ queues, exchanges, and bindings inside a Docker container

#!/usr/bin/env bash
set -e

# Configuration (can be overridden via env vars)
RABBITMQ_HOST="${RABBITMQ_HOST:-localhost}"
RABBITMQ_PORT="${RABBITMQ_PORT:-15672}"
RABBITMQ_USER="${RABBITMQ_USER:-guest}"
RABBITMQ_PASS="${RABBITMQ_PASS:-guest}"

# RabbitMQ HTTP API base URL
echo "Using RabbitMQ management API at $RABBITMQ_HOST:$RABBITMQ_PORT"
API_URL="http://$RABBITMQ_HOST:$RABBITMQ_PORT/api"

# CLI download URL
declare CLI_URL="http://$RABBITMQ_HOST:$RABBITMQ_PORT/cli/rabbitmqadmin"

echo "Ensuring rabbitmqadmin is available..."
if ! command -v rabbitmqadmin &> /dev/null; then
  echo "rabbitmqadmin not found, downloading from $CLI_URL"
  curl -s "$CLI_URL" -o /usr/local/bin/rabbitmqadmin
  chmod +x /usr/local/bin/rabbitmqadmin
fi

# RabbitMQ entities
# Request
REQUEST_QUEUE="payment-request"
REQUEST_EXCHANGE="payment-request-exchange"
REQUEST_ROUTING_KEY="payment-request-key"

# Success
SUCCESS_QUEUE="payment-response-success"
SUCCESS_EXCHANGE="payment-response-success-exchange"
SUCCESS_ROUTING_KEY="payment-response-success-key"

# Error
ERROR_QUEUE="payment-response-error"
ERROR_EXCHANGE="payment-response-error-exchange"
ERROR_ROUTING_KEY="payment-response-error-key"

# Functions to declare resources
function declare_queue() {
  local name="$1"
  echo "Declaring queue: $name"
  rabbitmqadmin \
    --host="$RABBITMQ_HOST" --port="$RABBITMQ_PORT" \
    --username="$RABBITMQ_USER" --password="$RABBITMQ_PASS" \
    declare queue name="$name" durable=true
}

function declare_exchange() {
  local name="$1"
  echo "Declaring exchange: $name"
  rabbitmqadmin \
    --host="$RABBITMQ_HOST" --port="$RABBITMQ_PORT" \
    --username="$RABBITMQ_USER" --password="$RABBITMQ_PASS" \
    declare exchange name="$name" type=direct durable=true
}

function declare_binding() {
  local exchange="$1" queue="$2" key="$3"
  echo "Binding $exchange -> $queue with routing key '$key'"
  rabbitmqadmin \
    --host="$RABBITMQ_HOST" --port="$RABBITMQ_PORT" \
    --username="$RABBITMQ_USER" --password="$RABBITMQ_PASS" \
    declare binding source="$exchange" destination_type=queue destination="$queue" routing_key="$key"
}

# Declare resources
declare_queue "$REQUEST_QUEUE"
declare_exchange "$REQUEST_EXCHANGE"
declare_binding "$REQUEST_EXCHANGE" "$REQUEST_QUEUE" "$REQUEST_ROUTING_KEY"

declare_queue "$SUCCESS_QUEUE"
declare_exchange "$SUCCESS_EXCHANGE"
declare_binding "$SUCCESS_EXCHANGE" "$SUCCESS_QUEUE" "$SUCCESS_ROUTING_KEY"

declare_queue "$ERROR_QUEUE"
declare_exchange "$ERROR_EXCHANGE"
declare_binding "$ERROR_EXCHANGE" "$ERROR_QUEUE" "$ERROR_ROUTING_KEY"

echo "RabbitMQ setup completed."
