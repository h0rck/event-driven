package dev.payment_service.facade;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import dev.payment_service.dto.PaymentDTO;
import dev.payment_service.producer.PaymentRequestProducer;

@Service
public class PaymentFacade {

    @Autowired
    private PaymentRequestProducer producer;

    public String process(PaymentDTO paymentDTO) {
        try {
            producer.sendPaymentRequest(paymentDTO);
        } catch (Exception e) {
            return "Error sending payment request: " + e.getMessage();
        }

        return "Payment request sent successfully";
    }

}