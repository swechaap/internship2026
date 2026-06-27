export type Role = 'ADMIN' | 'MANAGER' | 'ACCOUNTANT';

export type AuthResponse = {
  accessToken: string;
  refreshToken: string;
  email: string;
  role: Role;
  fullName: string;
};

export type DashboardSummary = {
  role: Role;
  totalUsers: number;
  totalExpenses: number;
  pendingApprovals: number;
  approvedExpenses: number;
  rejectedExpenses: number;
  monthlyExpenseTotal: number;
  budgetUtilizationPercent: number;
  recentItems: string[];
};

export type Expense = {
  id: number;
  expenseCode: string;
  title: string;
  description: string;
  amount: number;
  category: string;
  department: string;
  vendor: string;
  expenseDate: string;
  status: string;
  createdBy: string;
  createdAt: string;
};

export type Budget = {
  id: number;
  budgetName: string;
  department: string;
  allocatedAmount: number;
  usedAmount: number;
  remainingAmount: number;
  validFrom?: string;
  validTo?: string;
};

export type ReportResponse = {
  totalExpenses: number;
  byCategory: Record<string, number>;
  byDepartment: Record<string, number>;
};
