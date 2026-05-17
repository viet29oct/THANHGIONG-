package com.thanhgiong.licensing.service;

import com.thanhgiong.licensing.domain.entity.SupportTicket;
import com.thanhgiong.licensing.domain.enums.TicketStatus;
import com.thanhgiong.licensing.dto.support.SupportDtos.*;
import com.thanhgiong.licensing.exception.ApiException;
import com.thanhgiong.licensing.repository.*;
import com.thanhgiong.licensing.security.UserPrincipal;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@RequiredArgsConstructor
public class SupportService {
    private final SupportTicketRepository ticketRepository;
    private final UserRepository userRepository;
    private final OrderRepository orderRepository;

    @Transactional
    public TicketResponse create(UserPrincipal user, CreateTicketRequest req) {
        var ticket = SupportTicket.builder()
                .user(userRepository.findById(user.getId()).orElseThrow())
                .issueType(req.issueType())
                .description(req.description())
                .status(TicketStatus.OPEN)
                .build();
        if (req.orderId() != null) {
            ticket.setOrder(orderRepository.findById(req.orderId())
                    .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Order not found")));
        }
        return toResponse(ticketRepository.save(ticket));
    }

    public List<TicketResponse> myTickets(UserPrincipal user) {
        return ticketRepository.findByUserIdOrderByCreatedAtDesc(user.getId())
                .stream().map(this::toResponse).toList();
    }

    public List<TicketResponse> listOpen() {
        return ticketRepository.findByStatus(TicketStatus.OPEN).stream().map(this::toResponse).toList();
    }

    @Transactional
    public TicketResponse updateStatus(Long id, TicketStatus status) {
        var t = ticketRepository.findById(id)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Ticket not found"));
        t.setStatus(status);
        return toResponse(ticketRepository.save(t));
    }

    private TicketResponse toResponse(SupportTicket t) {
        return new TicketResponse(t.getId(), t.getIssueType(), t.getDescription(), t.getStatus().name(),
                t.getCreatedAt(), t.getOrder() != null ? t.getOrder().getId() : null);
    }
}
