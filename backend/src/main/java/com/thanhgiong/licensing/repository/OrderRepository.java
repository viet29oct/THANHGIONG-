package com.thanhgiong.licensing.repository;

import com.thanhgiong.licensing.domain.entity.Order;
import com.thanhgiong.licensing.domain.enums.OrderStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.EntityGraph;
import java.util.List;
import java.util.Optional;

public interface OrderRepository extends JpaRepository<Order, Long> {
    @EntityGraph(attributePaths = {"items", "items.product"})
    List<Order> findByUserIdOrderByCreatedAtDesc(Long userId);

    @EntityGraph(attributePaths = {"items", "items.product", "user"})
    Optional<Order> findById(Long id);

    List<Order> findByStatus(OrderStatus status);
}
