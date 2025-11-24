"use client";

import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Stack from "@mui/material/Stack";
import Image from "next/image";
import { useUser } from "@auth0/nextjs-auth0/client";
import { Alert, Skeleton } from "@mui/material";
import MobileNavigation from "./MobileNavigation";
import DesktopNavigation from "./DesktopNavigation";

export default function Header() {
  const { user, isLoading, error } = useUser();

  if (error) {
    return (
      <Alert severity="error">
        Something went wrong. Please try again later.
      </Alert>
    );
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
              <MobileNavigation />
              <DesktopNavigation />
            </>
          ) : null}
        </Stack>
      </Toolbar>
    </AppBar>
  );
}
