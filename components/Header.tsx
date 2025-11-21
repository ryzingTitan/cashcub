"use client";

import AppBar from "@mui/material/AppBar";
import Avatar from "@mui/material/Avatar";
import Toolbar from "@mui/material/Toolbar";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Image from "next/image";
import LogoutIcon from "@mui/icons-material/Logout";
import { useUser } from "@auth0/nextjs-auth0/client";
import { logoutUrl } from "@/lib/auth0";
import { Typography } from "@mui/material";

export default function Header() {
  const { user } = useUser();

  return (
    <AppBar position="static">
      <Toolbar>
        <Image src="/logo.png" alt="App Logo" width={50} height={50} />
        {user && (
          <Stack
            direction="row"
            spacing={1}
            sx={{ flexGrow: 1 }}
            justifyContent="flex-end"
            alignItems="center"
          >
            <Typography>Welcome, {user.name}</Typography>
            <Tooltip title={user?.name}>
              <Avatar src={user?.picture ?? undefined} />
            </Tooltip>
            <Tooltip title="Logout">
              <IconButton href={logoutUrl}>
                <LogoutIcon />
              </IconButton>
            </Tooltip>
          </Stack>
        )}
      </Toolbar>
    </AppBar>
  );
}
