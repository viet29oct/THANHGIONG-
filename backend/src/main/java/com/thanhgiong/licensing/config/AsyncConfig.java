package com.thanhgiong.licensing.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.task.TaskExecutor;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;

/**
 * Cấu hình thread pool cho @Async.
 * Mặc định Spring dùng SimpleAsyncTaskExecutor (tạo thread mới mỗi lần) — không phù hợp prod.
 */
@Configuration
@EnableAsync
public class AsyncConfig {

    /** Executor riêng cho gửi mail — tránh nghẽn task chung khi SMTP chậm. */
    @Bean(name = "mailExecutor")
    public TaskExecutor mailExecutor() {
        var ex = new ThreadPoolTaskExecutor();
        ex.setCorePoolSize(2);
        ex.setMaxPoolSize(5);
        ex.setQueueCapacity(100);
        ex.setThreadNamePrefix("mail-");
        ex.setWaitForTasksToCompleteOnShutdown(true);
        ex.setAwaitTerminationSeconds(30);
        ex.initialize();
        return ex;
    }

    /** Executor mặc định cho các @Async khác (audit log, v.v.). */
    @Bean(name = "taskExecutor")
    public TaskExecutor taskExecutor() {
        var ex = new ThreadPoolTaskExecutor();
        ex.setCorePoolSize(4);
        ex.setMaxPoolSize(10);
        ex.setQueueCapacity(200);
        ex.setThreadNamePrefix("async-");
        ex.setWaitForTasksToCompleteOnShutdown(true);
        ex.setAwaitTerminationSeconds(30);
        ex.initialize();
        return ex;
    }
}
