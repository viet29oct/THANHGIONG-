package com.thanhgiong.licensing.controller;

import com.thanhgiong.licensing.domain.enums.OrderStatus;
import com.thanhgiong.licensing.domain.enums.TicketStatus;
import com.thanhgiong.licensing.dto.order.OrderDtos.OrderResponse;
import com.thanhgiong.licensing.dto.product.ProductResponse;
import com.thanhgiong.licensing.dto.support.SupportDtos.TicketResponse;
import com.thanhgiong.licensing.service.AdminService;
import com.thanhgiong.licensing.service.OrderService;
import com.thanhgiong.licensing.service.SupportService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/admin")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('SUPER_ADMIN','STAFF','SUPPORT')")
public class AdminController {
    private final AdminService adminService;
    private final OrderService orderService;
    private final SupportService supportService;

    @GetMapping("/orders")
    public List<OrderResponse> orders() {
        return adminService.orders();
    }

    @PatchMapping("/orders/{id}/status")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN','STAFF')")
    public OrderResponse updateOrderStatus(@PathVariable Long id, @RequestParam OrderStatus status) {
        return orderService.updateStatus(id, status);
    }

    @GetMapping("/products")
    public List<ProductResponse> products() {
        return adminService.products();
    }

    @PatchMapping("/products/{id}/stock")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN','STAFF')")
    public ProductResponse updateStock(@PathVariable Long id, @RequestParam int stock) {
        return adminService.updateStock(id, stock);
    }

    @GetMapping("/tickets")
    public List<TicketResponse> tickets() {
        return adminService.tickets();
    }

    @PatchMapping("/tickets/{id}/status")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN','SUPPORT')")
    public TicketResponse updateTicket(@PathVariable Long id, @RequestParam TicketStatus status) {
        return supportService.updateStatus(id, status);
    }

    @PostMapping("/orders/{orderId}/resend-key")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN','STAFF','SUPPORT')")
    public void resendKey(@PathVariable Long orderId) {
        adminService.resendKey(orderId);
    }

    @PostMapping("/license-keys/{keyId}/replace")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN','STAFF')")
    public Map<String, String> replaceKey(@PathVariable Long keyId) {
        return adminService.replaceDefectiveKey(keyId);
    }

    @PostMapping("/license-keys/import")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public void importKey(@RequestParam Long productId, @RequestParam String key) {
        adminService.importKey(productId, key);
    }
}
