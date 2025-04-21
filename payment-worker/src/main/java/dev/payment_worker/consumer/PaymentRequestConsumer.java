package dev.payment_worker.consumer;

import java.util.Random;

import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.messaging.Message;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.stereotype.Component;

@Component
public class PaymentRequestConsumer {

    @RabbitListener(queues = { "payment-request" })
    public void consumePaymentRequest(@Payload Message<String> message) {
        System.out.println("Processing payment request: " + message.getPayload());

        if (new Random().nextBoolean()) {
            System.out.println("Payment processed successfully");
        } else {
            System.out.println("Payment processing failed");
        }
    }
}
