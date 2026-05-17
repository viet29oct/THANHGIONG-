package com.thanhgiong.licensing.repository;

import com.thanhgiong.licensing.domain.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface PaymentRepository extends JpaRepository<Payment, Long> {
    Optional<Payment> findByProviderAndTransactionId(String provider, String transactionId);
    boolean existsByProviderAndTransactionId(String provider, String transactionId);
}
