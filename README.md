# Event-Driven Architecture Project

Este projeto demonstra uma arquitetura orientada a eventos usando RabbitMQ como message broker, com serviços em Node.js e Traefik como reverse proxy.

## 🚀 Pré-requisitos

- Docker
- Docker Compose
- Git



## 🛠️ Configuração e Execução
1. Clone o repositório:
```bash
git clone <git@github.com:h0rck/Event-Driven-.git>
cd Event-Driven

2. Dê permissão de execução ao script de setup:
```bash
chmod +x setup-traefik.sh
```

3. Execute o script de setup para gerar os certificados:
```bash
./setup-traefik.sh
```

4. Inicie os serviços:
```bash
docker-compose up -d
```

