package com.thanhgiong.licensing.repository;

import com.thanhgiong.licensing.domain.entity.LicenseKey;
import com.thanhgiong.licensing.domain.enums.LicenseKeyStatus;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import java.time.Instant;
import java.util.List;
import java.util.Optional;

public interface LicenseKeyRepository extends JpaRepository<LicenseKey, Long> {
    @Query(value = "SELECT * FROM license_keys WHERE product_id = :productId AND status = 'AVAILABLE' ORDER BY id ASC LIMIT 1 FOR UPDATE SKIP LOCKED", nativeQuery = true)
    Optional<LicenseKey> findFirstAvailableSkipLocked(@Param("productId") Long productId);

    List<LicenseKey> findByStatusAndReservedUntilBefore(LicenseKeyStatus status, Instant before);

    List<LicenseKey> findByOrderId(Long orderId);

    long countByProductId(Long productId);
}
