package dev.payment_service.dto;

public class CardDetailsDTO {
    private String cardNumber;
    private String cardHolderName;
    private String expirationDate;
    private String cvv;

    public String getCardNumber() {
        return cardNumber;
    }

    public String getCardHolderName() {
        return cardHolderName;
    }

    public String getExpirationDate() {
        return expirationDate;
    }

    public String getCvv() {
        return cvv;
    }

}
