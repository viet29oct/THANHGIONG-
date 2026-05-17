package com.thanhgiong.licensing.service;

import com.thanhgiong.licensing.domain.entity.Product;
import com.thanhgiong.licensing.domain.enums.OrderStatus;
import com.thanhgiong.licensing.dto.order.OrderDtos.OrderResponse;
import com.thanhgiong.licensing.dto.product.ProductResponse;
import com.thanhgiong.licensing.dto.support.SupportDtos.TicketResponse;
import com.thanhgiong.licensing.exception.ApiException;
import com.thanhgiong.licensing.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AdminService {
    private final OrderService orderService;
    private final ProductRepository productRepository;
    private final SupportService supportService;
    private final LicenseKeyService licenseKeyService;
    private final LicenseKeyRepository licenseKeyRepository;
    private final OrderRepository orderRepository;
    private final EmailService emailService;
    private final EncryptionService encryptionService;

    public List<OrderResponse> orders() {
        return orderService.listAll();
    }

    public List<ProductResponse> products() {
        return productRepository.findAll().stream().map(ProductResponse::from).toList();
    }

    @Transactional
    public ProductResponse updateStock(Long productId, int stock) {
        var p = productRepository.findById(productId)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Product not found"));
        p.setStock(stock);
        return ProductResponse.from(productRepository.save(p));
    }

    public List<TicketResponse> tickets() {
        return supportService.listOpen();
    }

    public void resendKey(Long orderId) {
        var order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Order not found"));
        var keys = licenseKeyRepository.findByOrderId(orderId);
        if (keys.isEmpty()) throw new ApiException(HttpStatus.NOT_FOUND, "No keys for order");
        var email = order.getUser().getEmail();
        String body = keys.stream()
                .map(k -> k.getProduct().getName() + ": " + licenseKeyService.decryptKey(k))
                .reduce((a, b) -> a + "\n" + b).orElse("");
        emailService.sendLicenseKeys(email, String.valueOf(orderId), body);
    }

    @Transactional
    public Map<String, String> replaceDefectiveKey(Long keyId) {
        var replacement = licenseKeyService.replaceDefective(keyId);
        return Map.of("newKeyId", String.valueOf(replacement.getId()));
    }

    @Transactional
    public void importKey(Long productId, String plainKey) {
        var product = productRepository.findById(productId)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Product not found"));
        licenseKeyRepository.save(com.thanhgiong.licensing.domain.entity.LicenseKey.builder()
                .product(product)
                .encryptedKey(encryptionService.encrypt(plainKey))
                .status(com.thanhgiong.licensing.domain.enums.LicenseKeyStatus.AVAILABLE)
                .build());
    }
}
