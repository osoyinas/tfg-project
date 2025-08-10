"use client";

import { SSRKeycloakProvider, SSRCookies } from "@react-keycloak/ssr";
import type { ReactNode } from "react";

// Config Keycloak (público)

const keycloakCfg = {
  url: process.env.NEXT_PUBLIC_KEYCLOAK_URL!,
  realm: process.env.NEXT_PUBLIC_KEYCLOAK_REALM!,
  clientId: process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID!,
};


type Props = {
  children: ReactNode;
  // cookies vienen desde el server (layout) ya parseadas
  cookies?: Record<string, string>;
};

export default function Providers({ children, cookies }: Props) {
  return (
    <SSRKeycloakProvider
      keycloakConfig={keycloakCfg}
      persistor={SSRCookies(cookies)}
      initOptions={{
        onLoad: "check-sso",
        pkceMethod: "S256",
        checkLoginIframe: false,
        // silentCheckSsoRedirectUri: typeof window !== 'undefined' ? `${window.location.origin}/silent-check-sso.html` : undefined,
      }}
    >
      {children}
    </SSRKeycloakProvider>
  );
}
