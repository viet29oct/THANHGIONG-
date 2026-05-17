package com.thanhgiong.licensing.domain.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.Instant;

@Entity
@Table(name = "audit_logs")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class AuditLog {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(name = "actor_email")
    private String actorEmail;
    @Column(nullable = false)
    private String action;
    private String resource;
    @Column(columnDefinition = "TEXT")
    private String details;
    @Column(name = "ip_address")
    private String ipAddress;
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @PrePersist
    void prePersist() {
        if (createdAt == null) createdAt = Instant.now();
    }
}
