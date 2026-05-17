package com.thanhgiong.licensing.controller;

import com.thanhgiong.licensing.dto.support.SupportDtos.*;
import com.thanhgiong.licensing.service.SupportService;
import com.thanhgiong.licensing.util.SecurityUtils;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/v1/support")
@RequiredArgsConstructor
public class SupportController {
    private final SupportService supportService;

    @PostMapping("/tickets")
    public TicketResponse create(@Valid @RequestBody CreateTicketRequest req) {
        return supportService.create(SecurityUtils.currentUser(), req);
    }

    @GetMapping("/tickets")
    public List<TicketResponse> myTickets() {
        return supportService.myTickets(SecurityUtils.currentUser());
    }
}
