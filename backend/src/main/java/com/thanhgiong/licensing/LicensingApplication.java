package com.thanhgiong.licensing;

import com.thanhgiong.licensing.config.AppProperties;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.annotation.EnableScheduling;
import java.util.TimeZone;

@SpringBootApplication
@EnableScheduling
@EnableAsync
@EnableConfigurationProperties(AppProperties.class)
public class LicensingApplication {
    public static void main(String[] args) {
        // JVM may use Asia/Saigon on VN Windows; PostgreSQL only accepts IANA names like UTC / Asia/Ho_Chi_Minh
        TimeZone.setDefault(TimeZone.getTimeZone("UTC"));
        SpringApplication.run(LicensingApplication.class, args);
    }
}
