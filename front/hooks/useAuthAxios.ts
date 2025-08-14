import { useMemo } from "react";
import axios from "@/lib/axios-instance";
import { AxiosInstance } from "axios";
import { useKeycloak } from "@/components/keycloak-provider";

export function useAuthAxios(): AxiosInstance {
  const { keycloak, authenticated } = useKeycloak();

  // Instancia memoizada para evitar recrearla en cada render
  const instance = useMemo(() => {
    const authAxios = axios.create();

    // Interceptor para añadir el access_token
    authAxios.interceptors.request.use(
      async (config) => {
        if (authenticated && keycloak.token) {
            
          config.headers = config.headers || {};
          config.headers["Authorization"] = `Bearer ${keycloak.token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Interceptor para refrescar el token si hay 401
    authAxios.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;
        if (
          error.response &&
          error.response.status === 401 &&
          !originalRequest._retry &&
          keycloak.refreshToken
        ) {
          originalRequest._retry = true;
          try {
            await keycloak.updateToken(30);
            if (keycloak.token) {
              originalRequest.headers["Authorization"] = `Bearer ${keycloak.token}`;
              return authAxios(originalRequest);
            }
          } catch (refreshError) {
            keycloak.logout();
          }
        }
        return Promise.reject(error);
      }
    );

    return authAxios;
    // Solo se recrea si cambia el token o autenticación
  }, [authenticated, keycloak.token, keycloak.refreshToken]);

  return instance;
}
