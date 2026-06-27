package com.financeflow.entity;

import java.math.BigDecimal;
import java.time.LocalDate;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "budgets")
public class BudgetEntity extends BaseEntity {

    @Column(nullable = false)
    private String budgetName;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "department_id", nullable = false)
    private DepartmentEntity department;

    @Column(nullable = false, precision = 19, scale = 2)
    private BigDecimal allocatedAmount;

    @Column(nullable = false, precision = 19, scale = 2)
    private BigDecimal usedAmount;

    @Column(nullable = false, precision = 19, scale = 2)
    private BigDecimal remainingAmount;

    private LocalDate validFrom;
    private LocalDate validTo;

    @Column(nullable = false)
    private boolean alert80PercentSent;

    @Column(nullable = false)
    private boolean alertExceededSent;
}