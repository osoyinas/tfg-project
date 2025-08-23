"use client";

import { AuthGuard } from "@/components/AuthGuard";
import { BottomNavigation } from "@/components/bottom-navigation";
import { TopBar } from "@/components/top-bar";
import React from "react";

export default function BooksLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <TopBar />
      <AuthGuard>{children}</AuthGuard>
      <BottomNavigation />
    </>
  );}
