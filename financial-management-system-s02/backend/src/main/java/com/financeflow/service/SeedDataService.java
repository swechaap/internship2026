package com.financeflow.service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import com.financeflow.entity.BudgetEntity;
import com.financeflow.entity.DepartmentEntity;
import com.financeflow.entity.ExpenseEntity;
import com.financeflow.entity.RoleEntity;
import com.financeflow.entity.UserEntity;
import com.financeflow.entity.enums.ExpenseStatus;
import com.financeflow.entity.enums.RoleName;
import com.financeflow.repository.BudgetRepository;
import com.financeflow.repository.DepartmentRepository;
import com.financeflow.repository.ExpenseRepository;
import com.financeflow.repository.RoleRepository;
import com.financeflow.repository.UserRepository;

import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class SeedDataService implements CommandLineRunner {

    private final RoleRepository roleRepository;
    private final DepartmentRepository departmentRepository;
    private final UserRepository userRepository;
    private final ExpenseRepository expenseRepository;
    private final BudgetRepository budgetRepository;
    private final PasswordEncoder passwordEncoder;

    public SeedDataService(RoleRepository roleRepository, DepartmentRepository departmentRepository, UserRepository userRepository, ExpenseRepository expenseRepository, BudgetRepository budgetRepository, PasswordEncoder passwordEncoder) {
        this.roleRepository = roleRepository;
        this.departmentRepository = departmentRepository;
        this.userRepository = userRepository;
        this.expenseRepository = expenseRepository;
        this.budgetRepository = budgetRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        RoleEntity adminRole = ensureRole(RoleName.ADMIN.name());
        RoleEntity managerRole = ensureRole(RoleName.MANAGER.name());
        RoleEntity accountantRole = ensureRole(RoleName.ACCOUNTANT.name());

        DepartmentEntity finance = ensureDepartment("Finance");
        DepartmentEntity marketing = ensureDepartment("Marketing");
        DepartmentEntity operations = ensureDepartment("Operations");
        DepartmentEntity it = ensureDepartment("IT");

        ensureUser("Admin User", "admin@financeflow.com", "Admin@123", adminRole);
        ensureUser("Manager User", "manager@financeflow.com", "Manager@123", managerRole);
        UserEntity accountant = ensureUser("Accountant User", "accountant@financeflow.com", "Accountant@123", accountantRole);

        if (expenseRepository.count() == 0) {
            expenseRepository.saveAll(List.of(
                    expense("EXP-1001", "Hotel Stay", "Client meeting accommodation", new BigDecimal("12500"), "Travel", marketing, "Marriott", LocalDate.now().minusDays(3), ExpenseStatus.PENDING, accountant),
                    expense("EXP-1002", "Laptop", "Replacement laptop", new BigDecimal("86000"), "Equipment", it, "Dell", LocalDate.now().minusDays(12), ExpenseStatus.APPROVED, accountant),
                    expense("EXP-1003", "Internet Bill", "Monthly office internet", new BigDecimal("4500"), "Utilities", operations, "Airtel", LocalDate.now().minusDays(6), ExpenseStatus.REJECTED, accountant)));
        }

        if (budgetRepository.count() == 0) {
            budgetRepository.saveAll(List.of(
                    budget("Q2 Marketing", marketing, new BigDecimal("120000"), new BigDecimal("90000")),
                    budget("Q2 Finance", finance, new BigDecimal("150000"), new BigDecimal("78000"))));
        }
    }

    private RoleEntity ensureRole(String name) {
        return roleRepository.findByNameIgnoreCase(name)
                .orElseGet(() -> roleRepository.save(RoleEntity.builder().name(name).description(name + " role").build()));
    }

    private DepartmentEntity ensureDepartment(String name) {
        return departmentRepository.findByNameIgnoreCase(name)
                .orElseGet(() -> departmentRepository.save(DepartmentEntity.builder().name(name).description(name + " department").active(true).build()));
    }

    private UserEntity ensureUser(String fullName, String email, String password, RoleEntity role) {
        return userRepository.findByEmailIgnoreCase(email)
                .orElseGet(() -> userRepository.save(UserEntity.builder().fullName(fullName).email(email).passwordHash(passwordEncoder.encode(password)).role(role).active(true).build()));
    }

    private ExpenseEntity expense(String code, String title, String description, BigDecimal amount, String category, DepartmentEntity department, String vendor, LocalDate date, ExpenseStatus status, UserEntity createdBy) {
        return ExpenseEntity.builder()
                .expenseCode(code)
                .title(title)
                .description(description)
                .amount(amount)
                .category(category)
                .department(department)
                .vendor(vendor)
                .expenseDate(date)
                .status(status)
                .createdBy(createdBy)
                .build();
    }

    private BudgetEntity budget(String name, DepartmentEntity department, BigDecimal allocated, BigDecimal used) {
        return BudgetEntity.builder()
                .budgetName(name)
                .department(department)
                .allocatedAmount(allocated)
                .usedAmount(used)
                .remainingAmount(allocated.subtract(used))
                .alert80PercentSent(false)
                .alertExceededSent(false)
                .build();
    }
}