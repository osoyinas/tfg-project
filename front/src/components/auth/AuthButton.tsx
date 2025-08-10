// components/auth/AuthButton.tsx
"use client";

import { LogIn, User } from "lucide-react";
import { Button } from "@components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@components/ui/dropdown-menu";
// import { signIn, signOut, useSession } from "next-auth/react";

interface AuthButtonProps {
  onProfileClick?: () => void;
}

export function AuthButton({ onProfileClick }: AuthButtonProps) {
//   const { data: session, status } = useSession();

  if (status === "loading") {
    return null; // o spinner
  }

  // Usuario autenticado → botón de perfil
  if (true) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-8 w-8 rounded-full">
            <Avatar className="h-8 w-8">
              {/* <AvatarImage
                src={session.user?.image ?? "/placeholder.svg?height=32&width=32&text=U"}
                alt={session.user?.name ?? "Usuario"}
              /> */}
              {/* <AvatarFallback> */}
                {/* {session.user?.name?.[0] ?? "U"}
              </AvatarFallback> */}
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuItem onClick={onProfileClick}>
            <User className="mr-2 h-4 w-4" />
            <span>Mi Perfil</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          {/* <DropdownMenuItem onClick={() => signOut()}>
            Cerrar Sesión
          </DropdownMenuItem> */}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

//   // Usuario no autenticado → botón de login
//   return (
//     <Button variant="ghost" size="sm" onClick={() => signIn("keycloak")}>
//       <LogIn className="w-4 h-4 mr-2" />
//       Iniciar Sesión
//     </Button>
//   );
}
