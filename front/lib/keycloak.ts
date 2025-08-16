import Keycloak from "keycloak-js";

// Configuración de ejemplo, reemplaza con tus valores reales
const keycloakConfig = {
  pkceMethod: "S256",
  onLoad: "check-sso",
  silentCheckSsoRedirectUri: `${window?.location.origin}/silent-check-sso.html`,
  url: process.env.NEXT_PUBLIC_KEYCLOAK_URL!!,
  realm: process.env.NEXT_PUBLIC_KEYCLOAK_REALM!!,
  clientId: process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID!!,
};

const keycloak = new Keycloak(keycloakConfig);

export default keycloak;
