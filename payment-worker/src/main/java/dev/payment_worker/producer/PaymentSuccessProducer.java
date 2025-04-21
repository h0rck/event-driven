package dev.payment_worker.producer;

import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class PaymentSuccessProducer {

    @Autowired
    private RabbitTemplate rabbitTemplate;

    public void sendSuccessMessage(String message) {
        rabbitTemplate.convertAndSend(
                "payment-response-success-exchange",
                "payment-response-success-key",
                message);
    }

}
