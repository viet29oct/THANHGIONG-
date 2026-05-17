package com.thanhgiong.licensing.domain.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.Instant;

@Entity
@Table(name = "products")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Product {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false, unique = true)
    private String slug;
    @Column(nullable = false)
    private String name;
    private String version;
    private String category;
    @Column(name = "license_type")
    private String licenseType;
    @Column(columnDefinition = "TEXT")
    private String description;
    @Column(name = "short_description", columnDefinition = "TEXT")
    private String shortDescription;
    @Column(name = "image_url")
    private String imageUrl;
    @Column(nullable = false, precision = 15, scale = 2)
    private BigDecimal price;
    @Column(name = "original_price", precision = 15, scale = 2)
    private BigDecimal originalPrice;
    @Column(nullable = false)
    private int stock;
    private boolean featured;
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @PrePersist
    void prePersist() {
        if (createdAt == null) createdAt = Instant.now();
    }
}
