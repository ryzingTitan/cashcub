"use client";

import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import AnalyticsIcon from "@mui/icons-material/Analytics";
import Paper from "@mui/material/Paper";
import { usePathname, useRouter } from "next/navigation";

export default function Footer() {
  const pathname = usePathname();
  const router = useRouter();
  const value = pathname.includes("analytics") ? 1 : 0;

  return (
    <Paper
      sx={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        display: { xs: "block", md: "none" },
      }}
      elevation={3}
    >
      <BottomNavigation
        showLabels
        value={value}
        onChange={(_event, newValue) => {
          switch (newValue) {
            case 0:
              router.push("/budgets");
              return;
            case 1:
              router.push("/analytics");
              return;
          }
        }}
      >
        <BottomNavigationAction label="Budgets" icon={<AttachMoneyIcon />} />
        <BottomNavigationAction label="Analytics" icon={<AnalyticsIcon />} />
      </BottomNavigation>
    </Paper>
  );
}
