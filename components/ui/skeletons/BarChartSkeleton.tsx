import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";

interface BarChartSkeletonProps {
  barCount?: number;
  height?: number;
  testId?: string;
}

export default function BarChartSkeleton({
  barCount = 5,
  height = 300,
  testId,
}: BarChartSkeletonProps) {
  // Generate varying bar heights for realistic appearance
  const barHeights = Array.from({ length: barCount }, (_, i) => {
    const minHeight = 40;
    const maxHeight = 95;
    return minHeight + ((i * 13) % (maxHeight - minHeight));
  });

  return (
    <Box data-testid={testId} sx={{ height, width: "100%" }}>
      {/* Title */}
      <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
        <Skeleton variant="rectangular" width="40%" height={28} />
      </Box>

      {/* Chart area */}
      <Box
        sx={{
          display: "flex",
          height: "calc(100% - 60px)",
          position: "relative",
        }}
      >
        {/* Y-axis */}
        <Box
          sx={{
            width: 75,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <Skeleton
            variant="rectangular"
            width={75}
            height="80%"
            sx={{ mx: "auto" }}
          />
        </Box>

        {/* Bars container */}
        <Stack
          direction="row"
          spacing={1}
          sx={{
            flexGrow: 1,
            alignItems: "flex-end",
            justifyContent: "space-around",
            height: "80%",
            px: 1,
          }}
        >
          {barHeights.map((heightPercent, index) => (
            <Skeleton
              key={index}
              variant="rectangular"
              sx={{
                flex: 1,
                height: `${heightPercent}%`,
                maxWidth: 60,
              }}
            />
          ))}
        </Stack>
      </Box>

      {/* X-axis */}
      <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 1 }}>
        <Skeleton variant="rectangular" width="calc(100% - 75px)" height={30} />
      </Box>
    </Box>
  );
}
