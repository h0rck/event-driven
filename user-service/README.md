# Questões API

Este projeto é uma API desenvolvida em Node.js utilizando Express e TypeScript. A aplicação está containerizada usando Docker e Docker Compose, incluindo um banco de dados MySQL e o Traefik como proxy reverso. O ambiente de desenvolvimento utiliza o domínio personalizado `api.questoes.dev.localhost`.

## Índice

- [Pré-requisitos](#pré-requisitos)
- [Instalação](#instalação)
  1. [Clonar o Repositório](#1-clonar-o-repositório)
  2. [Configurar o Arquivo Hosts](#2-configurar-o-arquivo-hosts)
  3. [Gerar Certificados SSL (Opcional)](#3-gerar-certificados-ssl-opcional)
  4. [Configurar Variáveis de Ambiente](#4-configurar-variáveis-de-ambiente)
  5. [Executar as Migrações do Prisma](#5-executar-as-migrações-do-prisma)
  6. [Iniciar os Serviços com Docker Compose](#6-iniciar-os-serviços-com-docker-compose)

## Pré-requisitos

Antes de começar, certifique-se de ter os seguintes softwares instalados em seu sistema:

- Docker (versão 20.10 ou superior)
- Docker Compose (versão 1.29 ou superior)
- Node.js (versão 14 ou superior)
- npm (geralmente instalado junto com o Node.js)

## Instalação

### 1. Clonar o Repositório

```bash
  git clone <https://github.com/seu-usuario/seu-repositorio.git>
  cd seu-repositorio
```

### 2. Configurar o Arquivo Hosts

Edite o arquivo de hosts do seu sistema para mapear o domínio api.questoes.dev.localhost para 127.0.0.1.

No Linux ou macOS:

``` bash
sudo nano /etc/hosts
Adicione a seguinte linha ao final do arquivo:
```

127.0.0.1   api.questoes.dev.localhost
Salve e feche o arquivo.

### 3. Gerar Certificados SSL (Opcional)

Se você deseja acessar a aplicação via HTTPS em desenvolvimento, pode gerar certificados SSL autoassinados.

Gerar certificados autoassinados:

```bash
mkdir -p traefik/certs
openssl req -x509 -newkey rsa:4096 -sha256 -days 365 -nodes \
  -keyout traefik/certs/api.questoes.dev.localhost.key -out traefik/certs/api.questoes.dev.localhost.crt \
  -subj "/CN=api.questoes.dev.localhost" \
  -addext "subjectAltName=DNS:api.questoes.dev.localhost"
Nota: A configuração padrão utiliza HTTP na porta 80. Se optar por usar HTTPS, lembre-se de ajustar as configurações no docker-compose.yml e no traefik.yml.
```

### 4. Configurar Variáveis de Ambiente

Crie um arquivo .env na raiz do projeto e adicione a variável de ambiente para a conexão com o banco de dados:

env
DATABASE_URL="mysql://user:password@db:3306/meubanco"

### 5. Executar as Migrações do Prisma

Antes de iniciar os serviços, execute as migrações do Prisma para criar as tabelas no banco de dados:

```bash
npx prisma migrate dev --name init
```

### 6. Iniciar os Serviços com Docker Compose

Inicie os serviços da aplicação:

```bash
docker compose up --build
```
