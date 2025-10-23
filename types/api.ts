export interface Budget {
  id: string | null;
  month: number;
  year: number;
}

export interface BudgetSummary {
  id: string;
  month: number;
  year: number;
  expectedIncome: number;
  actualIncome: number;
  expectedExpenses: number;
  actualExpenses: number;
  budgetItems: BudgetItem[];
}

export interface BudgetItem {
  id: string | null;
  name: string;
  plannedAmount: number;
  actualAmount: number | null;
  budgetId: string | null;
  categoryId: string;
}

export interface Category {
  id: string;
  name: string;
}
