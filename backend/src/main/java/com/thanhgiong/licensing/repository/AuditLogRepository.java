package com.thanhgiong.licensing.repository;

import com.thanhgiong.licensing.domain.entity.AuditLog;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AuditLogRepository extends JpaRepository<AuditLog, Long> {}
