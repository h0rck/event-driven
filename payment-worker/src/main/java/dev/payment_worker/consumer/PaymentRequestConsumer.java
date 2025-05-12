package dev.payment_worker.consumer;

import java.util.Random;

import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.Message;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.stereotype.Component;

import dev.payment_worker.producer.PaymentErrorProducer;
import dev.payment_worker.producer.PaymentSuccessProducer;

@Component
public class PaymentRequestConsumer {

    private PaymentSuccessProducer paymentSuccessProducer;
    private PaymentErrorProducer paymentErrorProducer;

    public PaymentRequestConsumer(
            PaymentSuccessProducer paymentSuccessProducer,
            PaymentErrorProducer paymentErrorProducer) {
        this.paymentSuccessProducer = paymentSuccessProducer;
        this.paymentErrorProducer = paymentErrorProducer;
    }

    @RabbitListener(queues = { "payment-request" })
    public void consumePaymentRequest(@Payload Message<String> message) {
        System.out.println("Processing payment request: " + message.getPayload());
        if (new Random().nextBoolean()) {
            System.out.println("Payment processed successfully");
            paymentSuccessProducer.sendSuccessMessage("Payment processed successfully: " + message.getPayload());
        } else {
            System.out.println("Payment processing failed");
            paymentErrorProducer.sendErrorMessage("Payment processing failed: " + message.getPayload());
        }
    }
}
