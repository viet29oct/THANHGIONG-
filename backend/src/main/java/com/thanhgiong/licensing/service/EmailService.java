package com.thanhgiong.licensing.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {
    private final JavaMailSender mailSender;

    @Value("${spring.mail.username:noreply@thanhgiong.vn}")
    private String from;

    @Async
    public void send(String to, String subject, String body) {
        log.info("--------------------------------------------------");
        log.info("SIMULATING EMAIL SENDING...");
        log.info("TO: {}", to);
        log.info("SUBJECT: {}", subject);
        log.info("BODY: \n{}", body);
        log.info("--------------------------------------------------");
        
        try {
            var msg = new SimpleMailMessage();
            msg.setFrom(from);
            msg.setTo(to);
            msg.setSubject(subject);
            msg.setText(body);
            mailSender.send(msg);
        } catch (Exception e) {
            log.warn("Failed to send real email (SMTP not configured?): {}", e.getMessage());
        }
    }

    @Async
    public void sendVerification(String to, String link) {
        send(to, "Xác minh email — Thánh Gióng",
                "Nhấn liên kết để xác minh tài khoản:\n" + link);
    }

    @Async
    public void sendResetPassword(String to, String link) {
        send(to, "Đặt lại mật khẩu — Thánh Gióng",
                "Nhấn liên kết để đặt lại mật khẩu (hết hạn sau 1 giờ):\n" + link);
    }

    @Async
    public void sendLicenseKeys(String to, String orderId, String keysBody) {
        send(to, "License key đơn hàng #" + orderId,
                "Cảm ơn bạn đã mua hàng. Dưới đây là key license:\n\n" + keysBody);
    }
}
