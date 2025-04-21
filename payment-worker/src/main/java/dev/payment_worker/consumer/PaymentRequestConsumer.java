package dev.payment_worker.consumer;

import org.springframework.amqp.core.Message;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.stereotype.Component;

@Component
public class PaymentRequestConsumer {

    @RabbitListener(queues = "${payment-request-queue}")
    public void consumePaymentRequest(@Payload Message message) {
        System.out.println("Processing payment request: " + message);
    }

}