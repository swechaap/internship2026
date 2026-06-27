package com.financeflow.controller;

import com.financeflow.dto.dashboard.DashboardSummaryResponse;
import com.financeflow.service.DashboardService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final DashboardService dashboardService;

    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    @GetMapping("/admin")
    public ResponseEntity<DashboardSummaryResponse> admin() {
        return ResponseEntity.ok(dashboardService.admin());
    }

    @GetMapping("/manager")
    public ResponseEntity<DashboardSummaryResponse> manager() {
        return ResponseEntity.ok(dashboardService.manager());
    }

    @GetMapping("/accountant")
    public ResponseEntity<DashboardSummaryResponse> accountant() {
        return ResponseEntity.ok(dashboardService.accountant());
    }
}