"use client";

import { useKeycloak } from "@/components/keycloak-provider";
import { useEffect } from "react";
import { FullPageLoader } from "@/components/FullPageLoader";

interface AuthGuardProps {
  children: React.ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const { initialized, authenticated, keycloak } = useKeycloak();

  useEffect(() => {
    if (initialized && !authenticated) {
      keycloak?.login();
    }
  }, [initialized, authenticated, keycloak]);

  if (!initialized) {
    return (
      <>
        <FullPageLoader />
        <>{children}</>
      </>
    );
  }

  if (!authenticated) {
    return null; // Mientras redirige
  }

  return <>{children}</>;
}
