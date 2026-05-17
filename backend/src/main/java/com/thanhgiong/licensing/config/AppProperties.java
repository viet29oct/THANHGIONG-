package com.thanhgiong.licensing.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "app")
@Getter @Setter
public class AppProperties {
    private String frontendUrl = "http://localhost:5173";
    private Jwt jwt = new Jwt();
    private Cookie cookie = new Cookie();
    private License license = new License();
    private int reservationMinutes = 15;
    private RateLimit rateLimit = new RateLimit();
    private Vnpay vnpay = new Vnpay();

    @Getter @Setter
    public static class Jwt {
        private String secret;
        private long accessExpirationMs = 900_000;
        private long refreshExpirationMs = 604_800_000;
    }

    @Getter @Setter
    public static class Cookie {
        private boolean secure;
        private String sameSite = "Lax";
        private String domain = "";
    }

    @Getter @Setter
    public static class License {
        private String aesKey;
    }

    @Getter @Setter
    public static class RateLimit {
        private int requestsPerMinute = 120;
    }

    @Getter @Setter
    public static class Vnpay {
        private String tmnCode;
        private String hashSecret;
        private String baseUrl = "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html";
        private String returnUrl;
    }
}
