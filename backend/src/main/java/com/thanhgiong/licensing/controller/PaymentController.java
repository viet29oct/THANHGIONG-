package com.thanhgiong.licensing.controller;

import com.thanhgiong.licensing.dto.payment.PaymentDtos.*;
import com.thanhgiong.licensing.service.PaymentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/payments")
@RequiredArgsConstructor
public class PaymentController {
    private final PaymentService paymentService;

    @PostMapping("/webhook/{provider}")
    public void webhook(@PathVariable String provider, @Valid @RequestBody WebhookRequest req) {
        paymentService.processWebhook(new WebhookRequest(provider, req.transactionId(), req.orderId(), req.amount(), req.rawPayload()));
    }

    @GetMapping("/vnpay-ipn")
    public Map<String, String> vnpayIpn(@RequestParam Map<String, String> params) {
        return paymentService.processVnpayIpn(params);
    }
}
