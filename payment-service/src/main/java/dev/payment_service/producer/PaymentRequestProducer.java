package dev.payment_service.producer;

import org.springframework.amqp.core.AmqpTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import dev.payment_service.config.RabbitMQConfig;
import dev.payment_service.dto.PaymentDTO;

@Component
public class PaymentRequestProducer {
    @Autowired
    private AmqpTemplate amqpTemplate;

    private static ObjectMapper objectMapper = new ObjectMapper();

    public void sendPaymentRequest(PaymentDTO payment) throws JsonProcessingException {
        amqpTemplate.convertAndSend(
                RabbitMQConfig.PAYMENT_REQUEST_EXCHANGE,
                RabbitMQConfig.PAYMENT_REQUEST_ROUTING_KEY,
                objectMapper.writeValueAsString(payment));
    }

}
