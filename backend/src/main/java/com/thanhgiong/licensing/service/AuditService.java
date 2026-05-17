package com.thanhgiong.licensing.service;

import com.thanhgiong.licensing.domain.entity.AuditLog;
import com.thanhgiong.licensing.repository.AuditLogRepository;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuditService {
    private final AuditLogRepository auditLogRepository;

    @Async
    public void log(String actorEmail, String action, String resource, String details, String ipAddress) {
        auditLogRepository.save(AuditLog.builder()
                .actorEmail(actorEmail)
                .action(action)
                .resource(resource)
                .details(details)
                .ipAddress(ipAddress)
                .build());
    }
}
