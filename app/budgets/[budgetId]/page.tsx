import BudgetSummary from "@/components/features/budgets/BudgetSummary";
import AddTransactionModal from "@/components/ui/AddTransactionModal";

export default function Budget() {
  return (
    <>
      <BudgetSummary />
      <AddTransactionModal />
    </>
  );
}
