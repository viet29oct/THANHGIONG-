package com.thanhgiong.licensing.repository;

import com.thanhgiong.licensing.domain.entity.SupportTicket;
import com.thanhgiong.licensing.domain.enums.TicketStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface SupportTicketRepository extends JpaRepository<SupportTicket, Long> {
    List<SupportTicket> findByUserIdOrderByCreatedAtDesc(Long userId);
    List<SupportTicket> findByStatus(TicketStatus status);
}
