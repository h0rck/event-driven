FROM golang:1.24-alpine AS development

RUN apk add --no-cache git make gcc libc-dev

WORKDIR /app

RUN go install github.com/air-verse/air@latest

COPY go.mod go.sum ./
RUN go mod download

COPY . .

EXPOSE 3003

CMD ["air", "-c", ".air.toml"]
