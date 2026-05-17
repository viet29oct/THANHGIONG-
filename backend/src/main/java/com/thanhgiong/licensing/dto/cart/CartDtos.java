package com.thanhgiong.licensing.dto.cart;

import jakarta.validation.constraints.*;
import java.math.BigDecimal;
import java.util.List;

public class CartDtos {
    public record AddRequest(@NotNull Long productId, @Min(1) int quantity) {}
    public record UpdateRequest(@NotNull Long productId, @Min(1) int quantity) {}
    public record RemoveRequest(@NotNull Long productId) {}

    public record CartItemResponse(Long productId, String productName, String slug, String imageUrl,
                                   int quantity, BigDecimal unitPrice, BigDecimal lineTotal) {}

    public record CartResponse(List<CartItemResponse> items, BigDecimal total, int itemCount) {}
}
