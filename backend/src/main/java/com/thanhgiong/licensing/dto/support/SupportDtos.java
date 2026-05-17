package com.thanhgiong.licensing.dto.support;

import jakarta.validation.constraints.*;
import java.time.Instant;

public class SupportDtos {
    public record CreateTicketRequest(
            @NotBlank String issueType,
            @NotBlank String description,
            Long orderId) {}

    public record TicketResponse(Long id, String issueType, String description, String status,
                                 Instant createdAt, Long orderId) {}
}
