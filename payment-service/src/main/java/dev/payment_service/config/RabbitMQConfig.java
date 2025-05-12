package dev.payment_service.config;

import org.springframework.amqp.core.*;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.amqp.rabbit.annotation.EnableRabbit;

@Configuration
@EnableRabbit
public class RabbitMQConfig {

    // --- Constantes ---
    public static final String PAYMENT_REQUEST_QUEUE = "payment-request";
    public static final String PAYMENT_REQUEST_EXCHANGE = "payment-request-exchange";
    public static final String PAYMENT_REQUEST_ROUTING_KEY = "payment-request-key";

    public static final String PAYMENT_SUCCESS_QUEUE = "payment-response-success";
    public static final String PAYMENT_SUCCESS_EXCHANGE = "payment-response-success-exchange";
    public static final String PAYMENT_SUCCESS_ROUTING_KEY = "payment-response-success-key";

    public static final String PAYMENT_ERROR_QUEUE = "payment-response-error";
    public static final String PAYMENT_ERROR_EXCHANGE = "payment-response-error-exchange";
    public static final String PAYMENT_ERROR_ROUTING_KEY = "payment-response-error-key";

    /**
     * Agrupa todas as filas, exchanges e bindings.
     * O Spring Boot vai detectar esse bean e usar o RabbitAdmin para declará-los no
     * broker.
     */
    @Bean
    public Declarables rabbitDeclarables() {

        System.out.println("🔔 RabbitMQConfig.rabbitDeclarables() rodou — declarando filas, exchanges e bindings!");

        // queues
        Queue requestQueue = QueueBuilder.durable(PAYMENT_REQUEST_QUEUE).build();
        Queue successQueue = QueueBuilder.durable(PAYMENT_SUCCESS_QUEUE).build();
        Queue errorQueue = QueueBuilder.durable(PAYMENT_ERROR_QUEUE).build();

        // exchanges
        DirectExchange requestExchange = ExchangeBuilder
                .directExchange(PAYMENT_REQUEST_EXCHANGE)
                .durable(true)
                .build();
        DirectExchange successExchange = ExchangeBuilder
                .directExchange(PAYMENT_SUCCESS_EXCHANGE)
                .durable(true)
                .build();
        DirectExchange errorExchange = ExchangeBuilder
                .directExchange(PAYMENT_ERROR_EXCHANGE)
                .durable(true)
                .build();

        // bindings
        Binding bindRequest = BindingBuilder
                .bind(requestQueue)
                .to(requestExchange)
                .with(PAYMENT_REQUEST_ROUTING_KEY);
        Binding bindSuccess = BindingBuilder
                .bind(successQueue)
                .to(successExchange)
                .with(PAYMENT_SUCCESS_ROUTING_KEY);
        Binding bindError = BindingBuilder
                .bind(errorQueue)
                .to(errorExchange)
                .with(PAYMENT_ERROR_ROUTING_KEY);

        return new Declarables(
                requestQueue, successQueue, errorQueue,
                requestExchange, successExchange, errorExchange,
                bindRequest, bindSuccess, bindError);
    }
}
