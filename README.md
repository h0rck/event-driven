# 🚀 Event-Driven Architecture Project

Sistema de demonstração de arquitetura orientada a eventos utilizando tecnologias modernas e boas práticas de desenvolvimento.

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

- Docker (20.10+)
- Docker Compose (2.0+)
- Navegador moderno com suporte a HTTPS
- Porta 80, 443 e 8080 disponíveis

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

## 🏗️ Arquitetura do Sistema

