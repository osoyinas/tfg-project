
// Extrae el token de Keycloak de las cookies (ajusta el nombre si usas otro)
export function getTokenFromCookie(cookies: any): string | null {
  // Busca el token típico de Keycloak, ajusta el nombre si es necesario
  // Ejemplo: 'KEYCLOAK_TOKEN', 'kc-access', etc.
  // Puedes ver el nombre real en las cookies de tu navegador
  return cookies.get('KEYCLOAK_TOKEN')?.value || null;
}