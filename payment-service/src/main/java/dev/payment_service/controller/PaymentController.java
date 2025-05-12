package dev.payment_service.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import dev.payment_service.dto.PaymentDTO;
import dev.payment_service.facade.PaymentFacade;

@RestController

@RequestMapping("/api/v1/payment")

public class PaymentController {
    @Autowired
    private PaymentFacade paymentFacade;

    @PostMapping
    public String process(@RequestBody PaymentDTO paymentDTO) {
        return paymentFacade.process(paymentDTO);
    }

}