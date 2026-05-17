package com.thanhgiong.licensing.dto.product;

import com.thanhgiong.licensing.domain.entity.Product;
import java.math.BigDecimal;

public record ProductResponse(
        Long id,
        String slug,
        String name,
        String version,
        String category,
        String licenseType,
        String description,
        String shortDescription,
        String imageUrl,
        BigDecimal price,
        BigDecimal originalPrice,
        int stock,
        boolean featured,
        boolean inStock) {

    public static ProductResponse from(Product p) {
        return new ProductResponse(
                p.getId(), p.getSlug(), p.getName(), p.getVersion(), p.getCategory(),
                p.getLicenseType(), p.getDescription(), p.getShortDescription(), p.getImageUrl(),
                p.getPrice(), p.getOriginalPrice(), p.getStock(), p.isFeatured(), p.getStock() > 0);
    }
}
