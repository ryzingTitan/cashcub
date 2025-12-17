import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";

interface TransactionCardSkeletonProps {
  showNotes?: boolean;
  testId?: string;
}

export default function TransactionCardSkeleton({
  showNotes = false,
  testId,
}: TransactionCardSkeletonProps) {
  return (
    <Card sx={{ mb: 2 }} data-testid={testId}>
      <CardContent>
        <Stack spacing={1}>
          {/* Row 1: Amount + Type chip */}
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Skeleton variant="rectangular" width={80} height={32} />
            <Skeleton
              variant="rectangular"
              width={80}
              height={24}
              sx={{ borderRadius: 2 }}
            />
          </Stack>

          {/* Row 2: Date + Merchant */}
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Skeleton variant="rectangular" width={100} height={20} />
            <Skeleton variant="rectangular" width={120} height={20} />
          </Stack>

          {/* Row 3 (optional): Notes */}
          {showNotes && (
            <Skeleton variant="rectangular" width="90%" height={20} />
          )}

          {/* Action buttons row */}
          <Stack direction="row" spacing={1} justifyContent="flex-end" mt={1}>
            <Skeleton variant="circular" width={32} height={32} />
            <Skeleton variant="circular" width={32} height={32} />
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}
