package com.thanhgiong.licensing.config;

import com.thanhgiong.licensing.domain.entity.LicenseKey;
import com.thanhgiong.licensing.domain.entity.Product;
import com.thanhgiong.licensing.domain.enums.LicenseKeyStatus;
import com.thanhgiong.licensing.repository.LicenseKeyRepository;
import com.thanhgiong.licensing.repository.ProductRepository;
import com.thanhgiong.licensing.service.EncryptionService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.UUID;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataSeeder implements CommandLineRunner {

    private final ProductRepository productRepository;
    private final LicenseKeyRepository licenseKeyRepository;
    private final com.thanhgiong.licensing.repository.UserRepository userRepository;
    private final EncryptionService encryptionService;

    @Override
    public void run(String... args) {
        // Tự động xác minh email cho user test
        userRepository.findByEmail("serovv2910@gmail.com").ifPresent(user -> {
            if (!user.isEmailVerified()) {
                log.info("Auto-verifying email for test user: {}", user.getEmail());
                user.setEmailVerified(true);
                user.setVerificationToken(null);
                userRepository.save(user);
            }
        });

        List<Product> products = productRepository.findAll();
        for (Product product : products) {
            long count = licenseKeyRepository.countByProductId(product.getId());
            if (count == 0) {
                log.info("Seeding test license key for product: {}", product.getName());
                // Thêm 5 key cho mỗi loại để thoải mái test
                for (int i = 0; i < 5; i++) {
                    String testKey = product.getSlug().toUpperCase() + "-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
                    LicenseKey key = LicenseKey.builder()
                            .product(product)
                            .encryptedKey(encryptionService.encrypt(testKey))
                            .status(LicenseKeyStatus.AVAILABLE)
                            .build();
                    licenseKeyRepository.save(key);
                }
            }
        }
    }
}
