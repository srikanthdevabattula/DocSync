"use client";

import { ThemeProvider } from "next-themes";
import { AuthHydrator } from "@/components/providers/auth-hydrator";
import { StoreProvider } from "@/redux/provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";

type AppProvidersProps = {
  children: React.ReactNode;
};

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
      <StoreProvider>
        <TooltipProvider>
          <AuthHydrator />
          {children}
          <Toaster position="top-right" richColors closeButton />
        </TooltipProvider>
      </StoreProvider>
    </ThemeProvider>
  );
}
