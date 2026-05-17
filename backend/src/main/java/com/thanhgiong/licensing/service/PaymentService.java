package com.thanhgiong.licensing.service;

import com.thanhgiong.licensing.domain.entity.*;
import com.thanhgiong.licensing.domain.enums.*;
import com.thanhgiong.licensing.dto.payment.PaymentDtos.*;
import com.thanhgiong.licensing.exception.ApiException;
import com.thanhgiong.licensing.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.HashMap;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PaymentService {
    private final PaymentRepository paymentRepository;
    private final OrderRepository orderRepository;
    private final LicenseKeyRepository licenseKeyRepository;
    private final LicenseKeyService licenseKeyService;
    private final EmailService emailService;
    private final VNPayService vnpayService;

    @Transactional
    public PaymentResponse createPending(Long orderId, String provider, BigDecimal amount) {
        var order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Order not found"));
        if (order.getStatus() != OrderStatus.PENDING_PAYMENT) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Order not payable");
        }
        if (order.getTotalPrice().compareTo(amount) != 0) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Amount mismatch");
        }
        var payment = Payment.builder()
                .order(order).provider(provider).amount(amount)
                .status(PaymentStatus.PENDING).build();
        return PaymentResponse.from(paymentRepository.save(payment));
    }

    @Transactional
    public void processWebhook(WebhookRequest req) {
        if (paymentRepository.existsByProviderAndTransactionId(req.provider(), req.transactionId())) {
            return;
        }
        var order = orderRepository.findById(req.orderId())
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Order not found"));
        if (order.getTotalPrice().compareTo(req.amount()) != 0) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Amount mismatch");
        }
        if (order.getStatus() == OrderStatus.PAID) {
            return;
        }
        paymentRepository.save(Payment.builder()
                .order(order)
                .provider(req.provider())
                .transactionId(req.transactionId())
                .amount(req.amount())
                .status(PaymentStatus.SUCCESS)
                .rawPayload(req.rawPayload())
                .paidAt(Instant.now())
                .build());
        order.setStatus(OrderStatus.PAID);
        orderRepository.save(order);
        licenseKeyService.assignSold(order);
        deliverKeys(order);
    }

    @Transactional
    public Map<String, String> processVnpayIpn(Map<String, String> params) {
        // VNPay IPN Response codes
        // 00: Success
        // 01: Order not found
        // 02: Order already confirmed
        // 04: Invalid amount
        // 97: Invalid signature
        // 99: Unknown error

        if (!vnpayService.verifySignature(new HashMap<>(params))) {
            return Map.of("RspCode", "97", "Message", "Invalid signature");
        }

        String txnRef = params.get("vnp_TxnRef");
        Long orderId = Long.parseLong(txnRef.split("_")[0]);
        var order = orderRepository.findById(orderId).orElse(null);

        if (order == null) {
            return Map.of("RspCode", "01", "Message", "Order not found");
        }

        long vnpAmount = Long.parseLong(params.get("vnp_Amount")) / 100;
        if (order.getTotalPrice().longValue() != vnpAmount) {
            return Map.of("RspCode", "04", "Message", "Invalid amount");
        }

        if (order.getStatus() != OrderStatus.PENDING_PAYMENT) {
            return Map.of("RspCode", "02", "Message", "Order already confirmed");
        }

        if ("00".equals(params.get("vnp_ResponseCode"))) {
            paymentRepository.save(Payment.builder()
                    .order(order)
                    .provider("VNPAY")
                    .transactionId(params.get("vnp_TransactionNo"))
                    .amount(order.getTotalPrice())
                    .status(PaymentStatus.SUCCESS)
                    .rawPayload(params.toString())
                    .paidAt(Instant.now())
                    .build());
            order.setStatus(OrderStatus.PAID);
            orderRepository.save(order);
            licenseKeyService.assignSold(order);
            deliverKeys(order);
        } else {
            // Payment failed
            order.setStatus(OrderStatus.FAILED);
            orderRepository.save(order);
            licenseKeyService.releaseForOrder(order);
        }

        return Map.of("RspCode", "00", "Message", "Confirm success");
    }

    private void deliverKeys(Order order) {
        var keys = licenseKeyRepository.findByOrderId(order.getId());
        String body = keys.stream()
                .map(k -> k.getProduct().getName() + ": " + licenseKeyService.decryptKey(k))
                .collect(Collectors.joining("\n"));
        emailService.sendLicenseKeys(order.getUser().getEmail(), String.valueOf(order.getId()), body);
        order.setStatus(OrderStatus.DELIVERED);
        orderRepository.save(order);
    }
}
