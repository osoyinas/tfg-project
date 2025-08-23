import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { QueryClientProviderWrapper } from "@/components/query-client-provider-wrapper";
import { KeycloakProvider } from "@/components/keycloak-provider";
import { TopBar } from "@/components/top-bar";
import { BottomNavigation } from "@/components/bottom-navigation";
import { SavedItemsProvider } from "../components/saved-items-provider";

// Wrapper para mostrar el diálogo solo en cliente
function FirstLoginProfileDialogWrapper() {
  if (typeof window === "undefined") return null;
  const handleAvatarSelect = (avatar: string) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("profile_avatar", avatar);
    }
  };
  const Dialog =
    require("../components/first-login-profile-dialog").FirstLoginProfileDialog;
  return <Dialog onAvatarSelect={handleAvatarSelect} />;
}

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Movie book series app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Guardar avatar en localStorage (puedes cambiarlo por backend si lo deseas)
  const handleAvatarSelect = (avatar: string) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("profile_avatar", avatar);
    }
  };
  return (
    <html lang="en" className="dark">
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          inter.className
        )}
      >
        <FirstLoginProfileDialogWrapper />
        <SavedItemsProvider>
          <KeycloakProvider>
            <QueryClientProviderWrapper>
              <main className="flex-1">{children}</main>
            </QueryClientProviderWrapper>
          </KeycloakProvider>
        </SavedItemsProvider>
      </body>
    </html>
  );
}
