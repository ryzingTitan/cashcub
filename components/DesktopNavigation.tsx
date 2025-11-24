"use client";

import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import LogoutIcon from "@mui/icons-material/Logout";
import { useUser } from "@auth0/nextjs-auth0/client";
import { logoutUrl } from "@/lib/auth0";
import { Button, Typography } from "@mui/material";
import Link from "next/link";

export default function DesktopNavigation() {
  const { user } = useUser();

  return (
    <Box sx={{ display: { xs: "none", md: "flex" }, alignItems: "center" }}>
      <Button component={Link} href="/budgets" color="inherit">
        Budgets
      </Button>
      <Button component={Link} href="/analytics" color="inherit">
        Analytics
      </Button>
      <Typography>Hi, {user?.name}</Typography>
      <Tooltip title={user?.name ?? ""}>
        <Avatar
          src={user?.picture ?? undefined}
          alt={user?.name ?? ""}
          sx={{ ml: 2 }}
        />
      </Tooltip>
      <Tooltip title="Logout">
        <IconButton href={logoutUrl} sx={{ ml: 2 }}>
          <LogoutIcon />
        </IconButton>
      </Tooltip>
    </Box>
  );
}
