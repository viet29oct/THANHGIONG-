package com.thanhgiong.licensing.repository;

import com.thanhgiong.licensing.domain.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface ProductRepository extends JpaRepository<Product, Long> {
    Optional<Product> findBySlug(String slug);
    List<Product> findByFeaturedTrue();
}
