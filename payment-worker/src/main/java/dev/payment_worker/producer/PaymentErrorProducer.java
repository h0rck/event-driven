package dev.payment_worker.producer;

import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;

public class PaymentErrorProducer {
    @Autowired
    private RabbitTemplate rabbitTemplate;

    public void sendErrorMessage(String mensagem) {
        rabbitTemplate.convertAndSend(
                "payment-response-error-exchange",
                "payment-response-error-key",
                mensagem);
    }

}
