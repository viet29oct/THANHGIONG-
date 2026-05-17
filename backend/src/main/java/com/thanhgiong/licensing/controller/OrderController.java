package com.thanhgiong.licensing.controller;

import com.thanhgiong.licensing.dto.order.OrderDtos.OrderResponse;
import com.thanhgiong.licensing.service.OrderService;
import com.thanhgiong.licensing.util.SecurityUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/v1/orders")
@RequiredArgsConstructor
public class OrderController {
    private final OrderService orderService;

    @PostMapping
    public OrderResponse checkout() {
        return orderService.checkout(SecurityUtils.currentUser());
    }

    @GetMapping("/my-orders")
    public List<OrderResponse> myOrders() {
        return orderService.myOrders(SecurityUtils.currentUser());
    }

    @GetMapping("/{id}")
    public OrderResponse get(@PathVariable Long id) {
        return orderService.getOrder(SecurityUtils.currentUser(), id);
    }
}
