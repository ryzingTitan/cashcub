import type { Metadata } from "next";
import CssBaseline from "@mui/material/CssBaseline";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";

export const metadata: Metadata = {
  title: "Cash Cub",
  description: "A simple budgeting app",
};

import { Roboto } from "next/font/google";
import { ThemeProvider } from "@mui/material/styles";
import Header from "@/components/Header";
import theme from "@/theme";
import { SessionProvider } from "next-auth/react";

const roboto = Roboto({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-roboto",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={roboto.variable}>
      <body>
        <AppRouterCacheProvider>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <SessionProvider>
              <Header />
              {children}
            </SessionProvider>
          </ThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
