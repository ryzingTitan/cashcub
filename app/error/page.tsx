"use client";

import { Box, Button, Typography } from "@mui/material";
import { useRouter } from "next/navigation";

export default function ErrorPage() {
  const router = useRouter();

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        textAlign: "center",
      }}
    >
      <Typography variant="h4" gutterBottom>
        Oops! Something went wrong.
      </Typography>
      <Typography variant="body1" color="textSecondary" sx={{ mb: 4 }}>
        We&apos;re sorry, but an unexpected error has occurred.
      </Typography>
      <Button variant="contained" color="primary" onClick={() => router.push("/")}>
        HOME
      </Button>
    </Box>
  );
}
