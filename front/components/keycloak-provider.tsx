"use client";
import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import keycloak from "@/lib/keycloak";

interface KeycloakContextProps {
  keycloak: typeof keycloak;
  initialized: boolean;
  authenticated: boolean;
  login: () => void;
  logout: () => void;
}

const KeycloakContext = createContext<KeycloakContextProps | undefined>(undefined);

export const useKeycloak = () => {
  const ctx = useContext(KeycloakContext);
  if (!ctx) throw new Error("useKeycloak must be used within KeycloakProvider");
  return ctx;
};

export function KeycloakProvider({ children }: { children: ReactNode }) {
  const [initialized, setInitialized] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    keycloak
      .init({ onLoad: "check-sso", silentCheckSsoRedirectUri: window.location.origin + "/silent-check-sso.html" })
      .then((auth) => {
        setAuthenticated(auth);
        setInitialized(true);
      })
      .catch(() => {
        setInitialized(true);
        setAuthenticated(false);
      });
  }, []);

  const login = () => keycloak.login();
  const logout = () => keycloak.logout();

  return (
    <KeycloakContext.Provider value={{ keycloak, initialized, authenticated, login, logout }}>
      {children}
    </KeycloakContext.Provider>
  );
}
