package com.thanhgiong.licensing.dto.order;

import com.thanhgiong.licensing.domain.enums.OrderStatus;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

public class OrderDtos {
    public record OrderItemResponse(Long productId, String productName, int quantity, BigDecimal unitPrice) {}
    public record OrderResponse(Long id, OrderStatus status, BigDecimal totalPrice, Instant createdAt,
                                List<OrderItemResponse> items, String paymentUrl) {}
}
