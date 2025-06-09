"use client";

import { ClientLayoutWrapper } from "@/components/layout/ClientLayoutWrapper";
import { AuthProvider } from "@/context/AuthContext";

interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <AuthProvider>
      <ClientLayoutWrapper>{children}</ClientLayoutWrapper>
    </AuthProvider>
  );
}
