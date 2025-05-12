package dev.payment_service.config;

import org.springframework.amqp.core.*;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.amqp.rabbit.core.RabbitAdmin;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitMQConfig {

    // --- Constantes ---

    // Request
    public static final String PAYMENT_REQUEST_QUEUE = "payment-request";
    public static final String PAYMENT_REQUEST_EXCHANGE = "payment-request-exchange";
    public static final String PAYMENT_REQUEST_ROUTING_KEY = "payment-request-key";

    // Success
    public static final String PAYMENT_SUCCESS_QUEUE = "payment-response-success";
    public static final String PAYMENT_SUCCESS_EXCHANGE = "payment-response-success-exchange";
    public static final String PAYMENT_SUCCESS_ROUTING_KEY = "payment-response-success-key";

    // Error
    public static final String PAYMENT_ERROR_QUEUE = "payment-response-error";
    public static final String PAYMENT_ERROR_EXCHANGE = "payment-response-error-exchange";
    public static final String PAYMENT_ERROR_ROUTING_KEY = "payment-response-error-key";

    // --- Beans ---

    // Queues
    @Bean
    public Queue paymentRequestQueue() {
        return new Queue(PAYMENT_REQUEST_QUEUE, true);
    }

    @Bean
    public Queue paymentSuccessQueue() {
        return new Queue(PAYMENT_SUCCESS_QUEUE, true);
    }

    @Bean
    public Queue paymentErrorQueue() {
        return new Queue(PAYMENT_ERROR_QUEUE, true);
    }

    // Exchanges
    @Bean
    public DirectExchange paymentRequestExchange() {
        return new DirectExchange(PAYMENT_REQUEST_EXCHANGE, true, false);
    }

    @Bean
    public DirectExchange paymentSuccessExchange() {
        return new DirectExchange(PAYMENT_SUCCESS_EXCHANGE, true, false);
    }

    @Bean
    public DirectExchange paymentErrorExchange() {
        return new DirectExchange(PAYMENT_ERROR_EXCHANGE, true, false);
    }

    // Bindings
    @Bean
    public Binding bindRequest() {
        return BindingBuilder
                .bind(paymentRequestQueue())
                .to(paymentRequestExchange())
                .with(PAYMENT_REQUEST_ROUTING_KEY);
    }

    @Bean
    public Binding bindSuccess() {
        return BindingBuilder
                .bind(paymentSuccessQueue())
                .to(paymentSuccessExchange())
                .with(PAYMENT_SUCCESS_ROUTING_KEY);
    }

    @Bean
    public Binding bindError() {
        return BindingBuilder
                .bind(paymentErrorQueue())
                .to(paymentErrorExchange())
                .with(PAYMENT_ERROR_ROUTING_KEY);
    }

    // Admin para registrar tudo na subida
    @Bean
    public AmqpAdmin amqpAdmin(ConnectionFactory connectionFactory) {
        return new RabbitAdmin(connectionFactory);
    }
}
