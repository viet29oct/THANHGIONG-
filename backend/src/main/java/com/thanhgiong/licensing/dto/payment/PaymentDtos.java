package com.thanhgiong.licensing.dto.payment;

import com.thanhgiong.licensing.domain.entity.Payment;
import com.thanhgiong.licensing.domain.enums.PaymentStatus;
import jakarta.validation.constraints.*;
import java.math.BigDecimal;

public class PaymentDtos {
    public record WebhookRequest(
            @NotBlank String provider,
            @NotBlank String transactionId,
            @NotNull Long orderId,
            @NotNull @DecimalMin("0.01") BigDecimal amount,
            String rawPayload) {}

    public record PaymentResponse(Long id, Long orderId, String provider, PaymentStatus status, BigDecimal amount) {
        public static PaymentResponse from(Payment p) {
            return new PaymentResponse(p.getId(), p.getOrder().getId(), p.getProvider(), p.getStatus(), p.getAmount());
        }
    }
}
