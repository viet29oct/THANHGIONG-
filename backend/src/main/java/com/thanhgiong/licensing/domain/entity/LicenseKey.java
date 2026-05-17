package com.thanhgiong.licensing.domain.entity;

import com.thanhgiong.licensing.domain.enums.LicenseKeyStatus;
import jakarta.persistence.*;
import lombok.*;
import java.time.Instant;

@Entity
@Table(name = "license_keys")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class LicenseKey {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;
    @Column(name = "encrypted_key", nullable = false, columnDefinition = "TEXT")
    private String encryptedKey;
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private LicenseKeyStatus status;
    @Column(name = "reserved_until")
    private Instant reservedUntil;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id")
    private Order order;
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @PrePersist
    void prePersist() {
        if (createdAt == null) createdAt = Instant.now();
        if (status == null) status = LicenseKeyStatus.AVAILABLE;
    }
}
