package com.thanhgiong.licensing.service;

import com.thanhgiong.licensing.dto.product.ProductResponse;
import com.thanhgiong.licensing.exception.ApiException;
import com.thanhgiong.licensing.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductService {
    private final ProductRepository productRepository;

    public List<ProductResponse> list() {
        return productRepository.findAll().stream().map(ProductResponse::from).toList();
    }

    public ProductResponse getById(Long id) {
        return productRepository.findById(id).map(ProductResponse::from)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Product not found"));
    }

    public ProductResponse getBySlug(String slug) {
        return productRepository.findBySlug(slug).map(ProductResponse::from)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Product not found"));
    }
}
