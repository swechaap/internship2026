package com.financeflow.service;

import java.time.Instant;
import java.util.List;
import java.util.Locale;
import java.util.UUID;

import com.financeflow.dto.expense.ApprovalRequest;
import com.financeflow.dto.expense.ExpenseRequest;
import com.financeflow.dto.expense.ExpenseResponse;
import com.financeflow.entity.DepartmentEntity;
import com.financeflow.entity.ExpenseApprovalEntity;
import com.financeflow.entity.ExpenseEntity;
import com.financeflow.entity.ReceiptEntity;
import com.financeflow.entity.UserEntity;
import com.financeflow.entity.enums.ApprovalAction;
import com.financeflow.entity.enums.ExpenseStatus;
import com.financeflow.exception.ResourceNotFoundException;
import com.financeflow.repository.DepartmentRepository;
import com.financeflow.repository.ExpenseApprovalRepository;
import com.financeflow.repository.ExpenseRepository;
import com.financeflow.repository.ReceiptRepository;
import com.financeflow.repository.UserRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ExpenseService {

    private final ExpenseRepository expenseRepository;
    private final DepartmentRepository departmentRepository;
    private final ReceiptRepository receiptRepository;
    private final UserRepository userRepository;
    private final ExpenseApprovalRepository expenseApprovalRepository;
    private final AuditService auditService;
    private final NotificationService notificationService;

    public ExpenseService(ExpenseRepository expenseRepository, DepartmentRepository departmentRepository, ReceiptRepository receiptRepository, UserRepository userRepository, ExpenseApprovalRepository expenseApprovalRepository, AuditService auditService, NotificationService notificationService) {
        this.expenseRepository = expenseRepository;
        this.departmentRepository = departmentRepository;
        this.receiptRepository = receiptRepository;
        this.userRepository = userRepository;
        this.expenseApprovalRepository = expenseApprovalRepository;
        this.auditService = auditService;
        this.notificationService = notificationService;
    }

    @Transactional(readOnly = true)
    public List<ExpenseResponse> list() {
        return expenseRepository.findAll().stream().map(this::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public ExpenseResponse get(Long id) {
        return toResponse(findExpense(id));
    }

    @Transactional
    public ExpenseResponse create(ExpenseRequest request, String creatorEmail) {
        UserEntity createdBy = userRepository.findByEmailIgnoreCase(creatorEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        DepartmentEntity department = departmentRepository.findById(request.departmentId())
                .orElseThrow(() -> new ResourceNotFoundException("Department not found"));
        ExpenseEntity expense = ExpenseEntity.builder()
                .expenseCode("EXP-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase(Locale.ROOT))
                .title(request.title())
                .description(request.description())
                .amount(request.amount())
                .category(request.category())
                .department(department)
                .vendor(request.vendor())
                .expenseDate(request.expenseDate())
                .status(ExpenseStatus.PENDING)
                .createdBy(createdBy)
                .build();
        if (request.receiptId() != null) {
            ReceiptEntity receipt = receiptRepository.findById(request.receiptId())
                    .orElseThrow(() -> new ResourceNotFoundException("Receipt not found"));
            expense.setReceipt(receipt);
        }
        expense = expenseRepository.save(expense);
        auditService.record(createdBy, "EXPENSE_CREATE", "expenses", expense.getExpenseCode());
        notificationService.notify(createdBy, "Expense submitted", "Your expense is pending approval.", "EXPENSE");
        return toResponse(expense);
    }

    @Transactional
    public ExpenseResponse update(Long id, ExpenseRequest request, String actorEmail) {
        ExpenseEntity expense = findExpense(id);
        DepartmentEntity department = departmentRepository.findById(request.departmentId())
                .orElseThrow(() -> new ResourceNotFoundException("Department not found"));
        expense.setTitle(request.title());
        expense.setDescription(request.description());
        expense.setAmount(request.amount());
        expense.setCategory(request.category());
        expense.setDepartment(department);
        expense.setVendor(request.vendor());
        expense.setExpenseDate(request.expenseDate());
        if (request.receiptId() != null) {
            expense.setReceipt(receiptRepository.findById(request.receiptId())
                    .orElseThrow(() -> new ResourceNotFoundException("Receipt not found")));
        }
        ExpenseEntity saved = expenseRepository.save(expense);
        userRepository.findByEmailIgnoreCase(actorEmail).ifPresent(user -> auditService.record(user, "EXPENSE_UPDATE", "expenses", saved.getExpenseCode()));
        return toResponse(saved);
    }

    @Transactional
    public void delete(Long id, String actorEmail) {
        ExpenseEntity expense = findExpense(id);
        userRepository.findByEmailIgnoreCase(actorEmail).ifPresent(user -> auditService.record(user, "EXPENSE_DELETE", "expenses", expense.getExpenseCode()));
        expenseRepository.delete(expense);
    }

    @Transactional
    public ExpenseResponse approve(Long id, ApprovalRequest request, String reviewerEmail) {
        ExpenseEntity expense = findExpense(id);
        UserEntity reviewer = userRepository.findByEmailIgnoreCase(reviewerEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Reviewer not found"));
        ApprovalAction action = ApprovalAction.valueOf(request.action().toUpperCase(Locale.ROOT));
        expense.setStatus(action == ApprovalAction.APPROVE ? ExpenseStatus.APPROVED : ExpenseStatus.REJECTED);
        expenseRepository.save(expense);
        expenseApprovalRepository.save(ExpenseApprovalEntity.builder()
                .expense(expense)
                .reviewer(reviewer)
                .action(action)
                .remarks(request.remarks())
                .decidedAt(Instant.now())
                .build());
        auditService.record(reviewer, action.name() + "_EXPENSE", "expense_approvals", expense.getExpenseCode());
        return toResponse(expense);
    }

    @Transactional(readOnly = true)
    public ExpenseEntity findExpense(Long id) {
        return expenseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Expense not found"));
    }

    private ExpenseResponse toResponse(ExpenseEntity expense) {
        return new ExpenseResponse(
                expense.getId(),
                expense.getExpenseCode(),
                expense.getTitle(),
                expense.getDescription(),
                expense.getAmount(),
                expense.getCategory(),
                expense.getDepartment() != null ? expense.getDepartment().getName() : null,
                expense.getVendor(),
                expense.getExpenseDate(),
                expense.getStatus().name(),
                expense.getCreatedBy() != null ? expense.getCreatedBy().getEmail() : null,
                expense.getCreatedAt());
    }
}