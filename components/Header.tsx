"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
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
import { Skeleton } from "@mui/material";

export default function Header() {
  const { user, isLoading, error } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (error) {
      router.push("/error");
    }
  }, [error, router]);

  if (error) {
    return null;
  }

  return (
    <AppBar position="static">
      <Toolbar>
        <Image src="/logo.png" alt="App Logo" width={50} height={50} />
        <Stack
          direction="row"
          spacing={1}
          sx={{ flexGrow: 1 }}
          justifyContent="flex-end"
          alignItems="center"
        >
          {isLoading ? (
            <>
              <Skeleton
                variant="text"
                width={150}
                data-testid="loading-skeleton"
              />
              <Skeleton
                variant="circular"
                width={40}
                height={40}
                data-testid="loading-skeleton"
              />
              <Skeleton
                variant="circular"
                width={40}
                height={40}
                data-testid="loading-skeleton"
              />
            </>
          ) : user ? (
            <>
              <Tooltip title={user?.name ?? ""}>
                <Avatar
                  src={user?.picture ?? undefined}
                  alt={user?.name ?? ""}
                />
              </Tooltip>
              <Tooltip title="Logout">
                <IconButton href={logoutUrl}>
                  <LogoutIcon />
                </IconButton>
              </Tooltip>
            </>
          ) : null}
        </Stack>
      </Toolbar>
    </AppBar>
  );
}
