"use client";

import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import AnalyticsIcon from "@mui/icons-material/Analytics";
import { useState } from "react";
import Paper from "@mui/material/Paper";
import { usePathname, useRouter } from "next/navigation";

export default function Footer() {
  const pathname = usePathname();
  const [value, setValue] = useState(pathname.includes("analytics") ? 1 : 0);
  const router = useRouter();

  return (
    <Paper
      sx={{ position: "fixed", bottom: 0, left: 0, right: 0 }}
      elevation={3}
    >
      <BottomNavigation
        showLabels
        value={value}
        onChange={(_event, newValue) => {
          setValue(newValue);

          switch (newValue) {
            case 0:
              router.push("/budgets");
            case 1:
              router.push("/analytics");
            default:
              router.push("/budgets");
          }
        }}
      >
        <BottomNavigationAction label="Budgets" icon={<AttachMoneyIcon />} />
        <BottomNavigationAction label="Analytics" icon={<AnalyticsIcon />} />
      </BottomNavigation>
    </Paper>
  );
}
