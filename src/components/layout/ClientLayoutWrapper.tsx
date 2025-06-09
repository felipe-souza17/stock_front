"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Header from "@/components/layout/Header";

interface ClientLayoutWrapperProps {
  children: React.ReactNode;
}

export const ClientLayoutWrapper = ({ children }: ClientLayoutWrapperProps) => {
  const pathname = usePathname();

  const noHeaderRoutes = ["/login"];

  const shouldShowHeader = !noHeaderRoutes.includes(pathname);

  return (
    <>
      {shouldShowHeader && <Header />}{" "}
      <main className="flex-grow">{children}</main>
    </>
  );
};
