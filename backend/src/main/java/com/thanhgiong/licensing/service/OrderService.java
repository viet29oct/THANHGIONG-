package com.thanhgiong.licensing.service;

import com.thanhgiong.licensing.domain.entity.*;
import com.thanhgiong.licensing.domain.enums.OrderStatus;
import com.thanhgiong.licensing.dto.order.OrderDtos.*;
import com.thanhgiong.licensing.exception.ApiException;
import com.thanhgiong.licensing.repository.*;
import com.thanhgiong.licensing.security.UserPrincipal;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
public class OrderService {
    private final OrderRepository orderRepository;
    private final CartRepository cartRepository;
    private final LicenseKeyService licenseKeyService;
    private final VNPayService vnpayService;
    private final jakarta.servlet.http.HttpServletRequest request;

    @Transactional
    public OrderResponse checkout(UserPrincipal user) {
        var cart = cartRepository.findByUserId(user.getId())
                .orElseThrow(() -> new ApiException(HttpStatus.BAD_REQUEST, "Cart is empty"));
        if (cart.getItems().isEmpty()) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Cart is empty");
        }
        var order = Order.builder()
                .user(cart.getUser())
                .status(OrderStatus.PENDING_PAYMENT)
                .totalPrice(BigDecimal.ZERO)
                .build();
        BigDecimal total = BigDecimal.ZERO;
        for (CartItem ci : cart.getItems()) {
            if (ci.getProduct().getStock() < ci.getQuantity()) {
                throw new ApiException(HttpStatus.BAD_REQUEST, "Insufficient stock for " + ci.getProduct().getName());
            }
            order.getItems().add(OrderItem.builder()
                    .order(order).product(ci.getProduct())
                    .quantity(ci.getQuantity()).unitPrice(ci.getUnitPrice()).build());
            total = total.add(ci.getUnitPrice().multiply(BigDecimal.valueOf(ci.getQuantity())));
        }
        order.setTotalPrice(total);
        order = orderRepository.save(order);
        licenseKeyService.reserveForOrder(order);
        cart.getItems().clear();
        cartRepository.save(cart);

        String paymentUrl = vnpayService.createPaymentUrl(order.getId(), total.longValue(), request.getRemoteAddr());
        return toResponse(order, paymentUrl);
    }

    public List<OrderResponse> myOrders(UserPrincipal user) {
        return orderRepository.findByUserIdOrderByCreatedAtDesc(user.getId())
                .stream().map(o -> toResponse(o, null)).toList();
    }

    public OrderResponse getOrder(UserPrincipal user, Long id) {
        var order = orderRepository.findById(id)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Order not found"));
        if (!order.getUser().getId().equals(user.getId())
                && !user.getAuthorities().stream().anyMatch(a -> a.getAuthority().startsWith("ROLE_SUPER")
                    || a.getAuthority().startsWith("ROLE_STAFF") || a.getAuthority().startsWith("ROLE_SUPPORT"))) {
            throw new ApiException(HttpStatus.FORBIDDEN, "Access denied");
        }
        return toResponse(order, null);
    }

    @Transactional
    public OrderResponse updateStatus(Long orderId, OrderStatus status) {
        var order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Order not found"));
        order.setStatus(status);
        if (status == OrderStatus.CANCELLED || status == OrderStatus.FAILED) {
            licenseKeyService.releaseForOrder(order);
        }
        return toResponse(orderRepository.save(order), null);
    }

    public List<OrderResponse> listAll() {
        return orderRepository.findAll().stream().map(o -> toResponse(o, null)).toList();
    }

    private OrderResponse toResponse(Order o, String paymentUrl) {
        var items = o.getItems().stream().map(i -> new OrderItemResponse(
                i.getProduct().getId(), i.getProduct().getName(), i.getQuantity(), i.getUnitPrice()
        )).toList();
        return new OrderResponse(o.getId(), o.getStatus(), o.getTotalPrice(), o.getCreatedAt(), items, paymentUrl);
    }
}
