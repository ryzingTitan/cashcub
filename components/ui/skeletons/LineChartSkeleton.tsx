import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";

interface LineChartSkeletonProps {
  lineCount?: number;
  height?: number;
  testId?: string;
}

export default function LineChartSkeleton({
  lineCount = 2,
  height = 300,
  testId,
}: LineChartSkeletonProps) {
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

        {/* Line chart area */}
        <Box
          sx={{
            flexGrow: 1,
            position: "relative",
            height: "80%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          {/* Shaded area simulation */}
          <Skeleton
            variant="rectangular"
            width="100%"
            height="60%"
            sx={{ opacity: 0.3, mb: 2 }}
          />

          {/* Line paths simulation - using horizontal rectangles at varying positions */}
          <Stack
            spacing={1}
            sx={{
              position: "absolute",
              top: "50%",
              left: 0,
              right: 0,
              transform: "translateY(-50%)",
            }}
          >
            {Array.from({ length: lineCount }).map((_, lineIndex) => (
              <Stack
                key={lineIndex}
                direction="row"
                spacing={1}
                sx={{
                  width: "100%",
                  alignItems: "center",
                  opacity: 0.7,
                }}
              >
                {Array.from({ length: 6 }).map((_, segmentIndex) => (
                  <Skeleton
                    key={segmentIndex}
                    variant="rectangular"
                    sx={{
                      flex: 1,
                      height: 3,
                      transform: `translateY(${Math.sin((segmentIndex + lineIndex) * 0.8) * 20}px)`,
                    }}
                  />
                ))}
              </Stack>
            ))}
          </Stack>
        </Box>
      </Box>

      {/* X-axis */}
      <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 1 }}>
        <Skeleton variant="rectangular" width="calc(100% - 75px)" height={30} />
      </Box>
    </Box>
  );
}
