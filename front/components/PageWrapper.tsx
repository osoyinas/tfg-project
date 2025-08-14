"use client";

import React from "react";
import { useRouter, usePathname } from "next/navigation";


interface PageWrapperProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  subtitle?: string;
}

export function PageWrapper({ children, className = "", title, subtitle }: PageWrapperProps) {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <section
      className={
        "relative min-h-[60vh] max-w-4xl mx-auto px-4 py-8 sm:py-10 sm:px-8 bg-white/80 rounded-2xl shadow-lg border border-border " +
        className
      }
      style={{ boxShadow: "0 4px 32px 0 rgba(0,0,0,0.07)" }}
    >
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center px-3 py-1.5 rounded-md bg-muted hover:bg-accent text-foreground border border-border transition-colors"
        >
          <span className="mr-1">←</span> Volver
        </button>
        <span className="text-xs text-muted-foreground truncate max-w-[60vw]">
          Ruta actual: <span className="font-mono text-xs text-primary">{pathname}</span>
        </span>
      </div>
      {title && (
        <h1 className="text-3xl font-bold mb-2 text-primary leading-tight">{title}</h1>
      )}
      {subtitle && (
        <h2 className="text-lg font-medium mb-6 text-muted-foreground leading-snug">{subtitle}</h2>
      )}
      {children}
    </section>
  );
}
