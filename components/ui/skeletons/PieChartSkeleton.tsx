import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";

interface PieChartSkeletonProps {
  legendItemCount?: number;
  height?: number;
  testId?: string;
}

export default function PieChartSkeleton({
  legendItemCount = 5,
  height = 300,
  testId,
}: PieChartSkeletonProps) {
  return (
    <Box data-testid={testId} sx={{ height, width: "100%" }}>
      {/* Title */}
      <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
        <Skeleton variant="rectangular" width="40%" height={28} />
      </Box>

      {/* Chart and legend container */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "calc(100% - 50px)",
          gap: 4,
        }}
      >
        {/* Circular pie chart */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Skeleton variant="circular" width={200} height={200} />
        </Box>

        {/* Legend */}
        <Stack spacing={1.5} sx={{ minWidth: 120 }}>
          {Array.from({ length: legendItemCount }).map((_, index) => (
            <Stack key={index} direction="row" spacing={1} alignItems="center">
              <Skeleton variant="rectangular" width={16} height={16} />
              <Skeleton variant="rectangular" width={100} height={20} />
            </Stack>
          ))}
        </Stack>
      </Box>
    </Box>
  );
}
