package com.financeflow.controller;

import java.util.List;

import com.financeflow.dto.budget.BudgetRequest;
import com.financeflow.dto.budget.BudgetResponse;
import com.financeflow.service.BudgetService;

import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/budgets")
public class BudgetController {

    private final BudgetService budgetService;

    public BudgetController(BudgetService budgetService) {
        this.budgetService = budgetService;
    }

    @GetMapping
    public ResponseEntity<List<BudgetResponse>> list() {
        return ResponseEntity.ok(budgetService.list());
    }

    @PostMapping
    public ResponseEntity<BudgetResponse> save(@Valid @RequestBody BudgetRequest request) {
        return ResponseEntity.ok(budgetService.save(request));
    }
}