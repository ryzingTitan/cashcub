import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Skeleton from "@mui/material/Skeleton";
import Box from "@mui/material/Box";

interface CardSkeletonProps {
  children?: React.ReactNode;
  height?: number | string;
  showHeader?: boolean;
  headerHeight?: number;
  testId?: string;
}

export default function CardSkeleton({
  children,
  height,
  showHeader = false,
  headerHeight = 28,
  testId,
}: CardSkeletonProps) {
  return (
    <Card sx={{ height }} data-testid={testId}>
      <CardContent>
        {showHeader && (
          <Skeleton
            variant="rectangular"
            width="60%"
            height={headerHeight}
            sx={{ mb: 2 }}
          />
        )}
        {children || (
          <Box>
            <Skeleton variant="rectangular" width="100%" height={100} />
          </Box>
        )}
      </CardContent>
    </Card>
  );
}
