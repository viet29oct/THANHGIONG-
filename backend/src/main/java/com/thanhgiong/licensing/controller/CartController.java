package com.thanhgiong.licensing.controller;

import com.thanhgiong.licensing.dto.cart.CartDtos.*;
import com.thanhgiong.licensing.security.UserPrincipal;
import com.thanhgiong.licensing.service.CartService;
import com.thanhgiong.licensing.util.SecurityUtils;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/cart")
@RequiredArgsConstructor
public class CartController {
    private final CartService cartService;

    @GetMapping
    public CartResponse get() {
        return cartService.getCart(SecurityUtils.currentUser());
    }

    @PostMapping("/add")
    public CartResponse add(@Valid @RequestBody AddRequest req) {
        return cartService.add(SecurityUtils.currentUser(), req);
    }

    @PutMapping("/update")
    public CartResponse update(@Valid @RequestBody UpdateRequest req) {
        return cartService.update(SecurityUtils.currentUser(), req);
    }

    @DeleteMapping("/remove")
    public CartResponse remove(@RequestParam Long productId) {
        return cartService.remove(SecurityUtils.currentUser(), new RemoveRequest(productId));
    }
}
