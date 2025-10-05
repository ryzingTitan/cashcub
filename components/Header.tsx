"use client";

import AppBar from "@mui/material/AppBar";
import Avatar from "@mui/material/Avatar";
import Toolbar from "@mui/material/Toolbar";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Image from "next/image";
import { signOut, useSession } from "next-auth/react";
import Logout from "@mui/icons-material/Logout";

export default function Header() {
  const session = useSession();

  return (
    <AppBar position="static">
      <Toolbar>
        <Image src="/logo.png" alt="App Logo" width={50} height={50} />
        <Stack
          direction="row"
          spacing={1}
          sx={{ flexGrow: 1 }}
          justifyContent={"flex-end"}
        >
          <Tooltip title={session?.data?.user?.name}>
            <Avatar src={session?.data?.user?.image ?? undefined} />
          </Tooltip>
          <Tooltip title="Logout">
            <IconButton
              onClick={async () => {
                await signOut();
              }}
            >
              <Logout />
            </IconButton>
          </Tooltip>
        </Stack>
      </Toolbar>
    </AppBar>
  );
}
