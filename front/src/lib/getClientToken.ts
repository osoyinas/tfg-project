// src/lib/getClientToken.ts
import { getToken } from "next-auth/jwt";

export async function getClientToken(): Promise<string | null> {
  // next-auth/jwt no funciona en el cliente, así que normalmente el token se obtiene de la sesión
  // o de cookies. Aquí se deja como placeholder para SSR/edge.
  return null;
}
