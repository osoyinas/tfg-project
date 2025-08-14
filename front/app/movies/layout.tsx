"use client";

import { AuthGuard } from "@/components/AuthGuard";
import React from "react";

export default function BooksLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AuthGuard>{children}</AuthGuard>;
}
