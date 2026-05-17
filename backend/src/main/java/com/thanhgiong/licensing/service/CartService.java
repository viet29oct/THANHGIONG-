package com.thanhgiong.licensing.service;

import com.thanhgiong.licensing.domain.entity.*;
import com.thanhgiong.licensing.dto.cart.CartDtos.*;
import com.thanhgiong.licensing.exception.ApiException;
import com.thanhgiong.licensing.repository.*;
import com.thanhgiong.licensing.security.UserPrincipal;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;

@Service
@RequiredArgsConstructor
public class CartService {
    private final CartRepository cartRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;

    @Transactional
    public CartResponse getCart(UserPrincipal user) {
        return toResponse(getOrCreateCart(user.getId()));
    }

    @Transactional
    public CartResponse add(UserPrincipal user, AddRequest req) {
        var cart = getOrCreateCart(user.getId());
        var product = productRepository.findById(req.productId())
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Product not found"));
        if (product.getStock() < req.quantity()) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Insufficient stock");
        }
        var existing = cart.getItems().stream()
                .filter(i -> i.getProduct().getId().equals(product.getId())).findFirst();
        if (existing.isPresent()) {
            existing.get().setQuantity(existing.get().getQuantity() + req.quantity());
            existing.get().setUnitPrice(product.getPrice());
        } else {
            cart.getItems().add(CartItem.builder()
                    .cart(cart).product(product).quantity(req.quantity()).unitPrice(product.getPrice()).build());
        }
        return toResponse(cartRepository.save(cart));
    }

    @Transactional
    public CartResponse update(UserPrincipal user, UpdateRequest req) {
        var cart = getOrCreateCart(user.getId());
        var item = cart.getItems().stream()
                .filter(i -> i.getProduct().getId().equals(req.productId())).findFirst()
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Item not in cart"));
        if (item.getProduct().getStock() < req.quantity()) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Insufficient stock");
        }
        item.setQuantity(req.quantity());
        return toResponse(cartRepository.save(cart));
    }

    @Transactional
    public CartResponse remove(UserPrincipal user, RemoveRequest req) {
        var cart = getOrCreateCart(user.getId());
        cart.getItems().removeIf(i -> i.getProduct().getId().equals(req.productId()));
        return toResponse(cartRepository.save(cart));
    }

    private Cart getOrCreateCart(Long userId) {
        return cartRepository.findByUserId(userId).orElseGet(() -> {
            var user = userRepository.findById(userId).orElseThrow();
            return cartRepository.save(Cart.builder().user(user).build());
        });
    }

    private CartResponse toResponse(Cart cart) {
        var items = cart.getItems().stream().map(i -> new CartItemResponse(
                i.getProduct().getId(), i.getProduct().getName(), i.getProduct().getSlug(),
                i.getProduct().getImageUrl(), i.getQuantity(), i.getUnitPrice(),
                i.getUnitPrice().multiply(BigDecimal.valueOf(i.getQuantity()))
        )).toList();
        var total = items.stream().map(CartItemResponse::lineTotal).reduce(BigDecimal.ZERO, BigDecimal::add);
        var count = items.stream().mapToInt(CartItemResponse::quantity).sum();
        return new CartResponse(items, total, count);
    }
}
