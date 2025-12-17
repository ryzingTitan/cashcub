import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";

interface BudgetSummaryCardSkeletonProps {
  testId?: string;
}

export default function BudgetSummaryCardSkeleton({
  testId,
}: BudgetSummaryCardSkeletonProps) {
  return (
    <Card sx={{ minWidth: 200, flex: 1 }} data-testid={testId}>
      <CardContent>
        <Stack alignItems="center" spacing={1}>
          <Skeleton variant="rectangular" width="70%" height={32} />
          <Skeleton variant="rectangular" width="60%" height={28} />
        </Stack>
      </CardContent>
    </Card>
  );
}
