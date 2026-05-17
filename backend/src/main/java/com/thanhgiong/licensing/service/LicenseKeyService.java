package com.thanhgiong.licensing.service;

import com.thanhgiong.licensing.config.AppProperties;
import com.thanhgiong.licensing.domain.entity.*;
import com.thanhgiong.licensing.domain.enums.LicenseKeyStatus;
import com.thanhgiong.licensing.exception.ApiException;
import com.thanhgiong.licensing.repository.LicenseKeyRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class LicenseKeyService {
    private final LicenseKeyRepository licenseKeyRepository;
    private final EncryptionService encryptionService;
    private final AppProperties appProperties;

    @Transactional
    public List<LicenseKey> reserveForOrder(Order order) {
        List<LicenseKey> reserved = new ArrayList<>();
        Instant until = Instant.now().plusSeconds(appProperties.getReservationMinutes() * 60L);
        for (OrderItem item : order.getItems()) {
            for (int i = 0; i < item.getQuantity(); i++) {
                var key = licenseKeyRepository.findFirstAvailableSkipLocked(item.getProduct().getId())
                        .orElseThrow(() -> new ApiException(HttpStatus.CONFLICT, "No license keys available for " + item.getProduct().getName()));
                key.setStatus(LicenseKeyStatus.RESERVED);
                key.setReservedUntil(until);
                key.setOrder(order);
                licenseKeyRepository.save(key);
                reserved.add(key);
            }
        }
        return reserved;
    }

    @Transactional
    public void assignSold(Order order) {
        var keys = licenseKeyRepository.findByOrderId(order.getId());
        for (var key : keys) {
            key.setStatus(LicenseKeyStatus.SOLD);
            key.setReservedUntil(null);
            licenseKeyRepository.save(key);
        }
    }

    @Transactional
    public void releaseForOrder(Order order) {
        var keys = licenseKeyRepository.findByOrderId(order.getId());
        for (var key : keys) {
            if (key.getStatus() == LicenseKeyStatus.RESERVED) {
                key.setStatus(LicenseKeyStatus.AVAILABLE);
                key.setReservedUntil(null);
                key.setOrder(null);
                licenseKeyRepository.save(key);
            }
        }
    }

    public String decryptKey(LicenseKey key) {
        return encryptionService.decrypt(key.getEncryptedKey());
    }

    @Scheduled(fixedRate = 60_000)
    @Transactional
    public void releaseExpiredReservations() {
        var expired = licenseKeyRepository.findByStatusAndReservedUntilBefore(
                LicenseKeyStatus.RESERVED, Instant.now());
        for (var key : expired) {
            key.setStatus(LicenseKeyStatus.AVAILABLE);
            key.setReservedUntil(null);
            key.setOrder(null);
            licenseKeyRepository.save(key);
        }
    }

    @Transactional
    public LicenseKey replaceDefective(Long keyId) {
        var defective = licenseKeyRepository.findById(keyId)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Key not found"));
        defective.setStatus(LicenseKeyStatus.DEFECTIVE);
        licenseKeyRepository.save(defective);
        var replacement = licenseKeyRepository.findFirstAvailableSkipLocked(defective.getProduct().getId())
                .orElseThrow(() -> new ApiException(HttpStatus.CONFLICT, "No replacement key"));
        replacement.setStatus(LicenseKeyStatus.SOLD);
        replacement.setOrder(defective.getOrder());
        return licenseKeyRepository.save(replacement);
    }
}
