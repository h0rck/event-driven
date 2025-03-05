# README.md for User Service

# User Service

This project is a microservice for user registration and management in a ticket purchasing system. It utilizes Fastify for building the API and RabbitMQ for messaging.

## Features

- User registration and management
- Integration with RabbitMQ for messaging
- Validation of user data
- Database connection handling

## Project Structure

```
user-service
├── src
│   ├── api
│   │   ├── controllers
│   │   ├── routes
│   │   └── schemas
│   ├── config
│   ├── domain
│   │   ├── entities
│   │   └── repositories
│   ├── infrastructure
│   │   ├── database
│   │   └── messaging
│   ├── services
│   └── app.ts
├── tests
│   └── integration
├── Dockerfile
├── package.json
└── tsconfig.json
```

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd user-service
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

## Usage

To start the application, run:
```bash
npm start
```

## Testing

To run the tests, use:
```bash
npm test
```

## License

This project is licensed under the MIT License.