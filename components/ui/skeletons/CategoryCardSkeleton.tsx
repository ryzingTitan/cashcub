import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";

interface CategoryCardSkeletonProps {
  itemCount?: number;
  testId?: string;
}

export default function CategoryCardSkeleton({
  itemCount = 2,
  testId,
}: CategoryCardSkeletonProps) {
  return (
    <Card sx={{ height: "100%" }} data-testid={testId}>
      <CardContent>
        {/* Header row: Category name + Add button */}
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Skeleton variant="rectangular" width="40%" height={28} />
          <Skeleton variant="circular" width={40} height={40} />
        </Stack>

        <Divider sx={{ m: 2 }} />

        {/* List of budget items */}
        <List>
          {Array.from({ length: itemCount }).map((_, index) => (
            <ListItem
              key={index}
              sx={{ flexDirection: { xs: "column", sm: "row" }, mb: 2 }}
            >
              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={2}
                sx={{
                  width: "100%",
                  alignItems: { xs: "flex-start", sm: "center" },
                }}
              >
                {/* Item name */}
                <Skeleton
                  variant="rectangular"
                  width="50%"
                  height={24}
                  sx={{ mb: { xs: 1, sm: 0 } }}
                />

                {/* Three columns: Planned, Actual, Remaining */}
                <Stack
                  direction="row"
                  spacing={2}
                  sx={{
                    flexGrow: 1,
                    justifyContent: { xs: "center", sm: "flex-end" },
                  }}
                >
                  <Stack alignItems="center">
                    <Skeleton
                      variant="rectangular"
                      width={60}
                      height={16}
                      sx={{ mb: 0.5 }}
                    />
                    <Skeleton variant="rectangular" width={60} height={20} />
                  </Stack>
                  <Stack alignItems="center">
                    <Skeleton
                      variant="rectangular"
                      width={60}
                      height={16}
                      sx={{ mb: 0.5 }}
                    />
                    <Skeleton variant="rectangular" width={60} height={20} />
                  </Stack>
                  <Stack alignItems="center">
                    <Skeleton
                      variant="rectangular"
                      width={60}
                      height={16}
                      sx={{ mb: 0.5 }}
                    />
                    <Skeleton variant="rectangular" width={60} height={20} />
                  </Stack>
                </Stack>

                {/* Action icons */}
                <Stack direction="row" spacing={1}>
                  <Skeleton variant="circular" width={24} height={24} />
                  <Skeleton variant="circular" width={24} height={24} />
                  <Skeleton variant="circular" width={24} height={24} />
                </Stack>
              </Stack>
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  );
}
