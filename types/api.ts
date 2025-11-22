export type TransactionType = "INCOME" | "EXPENSE";

export interface Budget {
  readonly id: string | null;
  month: number;
  year: number;
}

export interface BudgetSummary {
  readonly id: string;
  month: number;

  year: number;
  expectedIncome: number;
  actualIncome: number;
  expectedExpenses: number;
  actualExpenses: number;
  budgetItems: BudgetItem[];
}

export interface BudgetItem {
  readonly id: string | null;
  name: string;
  plannedAmount: number;
  actualAmount: number | null;
  readonly budgetId: string | null;
  readonly categoryId: string;
}

export interface Category {
  readonly id: string;
  name: string;
}

export interface Transaction {
  readonly id: string | null;
  date: string;
  amount: number;
  transactionType: TransactionType;
  merchant: string | null;
  notes: string | null;
  readonly budgetId: string | null;
  readonly budgetItemId: string | null;
}
