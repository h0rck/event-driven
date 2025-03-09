# 🚀 Arquitetura Orientada a Eventos

### Monitor Frontend
![Monitor Frontend](./assets/images/monitor-frontend.png)

### 📊 Diagrama da Arquitetura
```mermaid
graph TD
    Client[Client Browser] --> |HTTPS| Traefik[Traefik Proxy]
    
    Traefik --> |/api/v1/events/*| EventService[Event Service]
    Traefik --> |/socket.io| MonitorService[Monitor Service]
    Traefik --> |/* static| Frontend[Monitor Frontend]
    Traefik --> |/api| RabbitMQMgmt[RabbitMQ Management]
    
    EventService --> |Publish Events| RabbitMQ[RabbitMQ]
    MonitorService --> |Monitor Queues| RabbitMQ
    EmailService[Email Service] --> |Consume Events| RabbitMQ
    
    subgraph Services
        EventService
        MonitorService
        EmailService
    end
    
    subgraph Message Broker
        RabbitMQ
    end
    
    subgraph Frontend Layer
        Frontend --> |WebSocket| MonitorService
    end

    classDef container fill:#e1f5fe,stroke:#01579b,stroke-width:2px;
    classDef proxy fill:#fff3e0,stroke:#ff6f00,stroke-width:2px;
    classDef client fill:#f1f8e9,stroke:#33691e,stroke-width:2px;
    classDef broker fill:#fce4ec,stroke:#880e4f,stroke-width:2px;
    
    class Client client;
    class Traefik proxy;
    class RabbitMQ,RabbitMQMgmt broker;
    class EventService,MonitorService,EmailService,Frontend container;
```

## 📋 Stack Tecnológica

- **Message Broker:** RabbitMQ
- **Reverse Proxy:** Traefik (com HTTPS)
- **Microsserviços:**
  - **Event Service:** Node.js com Fastify
  - **Email Service:** Node.js (Consumer RabbitMQ)
  - **Monitor Service:** Node.js com Socket.IO 
- **Frontend:** React.js com Socket.IO 
- **Containers:** Docker & Docker Compose

## 🔧 Pré-requisitos

- Docker 
- Docker Compose 
- Navegador moderno com suporte a HTTPS
- Portas disponíveis:
  - 80: HTTP
  - 443: HTTPS
  - 8080: Traefik Dashboard
  - 5672: RabbitMQ AMQP
  - 15672: RabbitMQ Management
  - 3000: Event Service
  - 3001: Email Service
  - 3002: Monitor Service
  - 5173: Monitor Frontend (React)

## ⚙️ Instalação e Configuração

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/h0rck/event-driven.git
   cd event-driven
   ```

2. **Configure o ambiente:**
   ```bash
   chmod +x setup-traefik.sh
   ./setup-traefik.sh
   ```

3. **Inicie os serviços:**
   ```bash
   docker-compose up -d
   ```

## 🌐 Acessando os Serviços

- **Monitor Frontend:** https://monitor.dev.localhost
- **RabbitMQ Dashboard:** https://rabbitmq.dev.localhost
  - Usuario: guest
  - Senha: guest
- **Traefik Dashboard:** traefik.dev.localhost
- **APIs:**
  - Event Service: https://event-service.dev.localhost
  - Email Service: https://email-service.dev.localhost
  - Monitor Service: https://monitor-service.dev.localhost


