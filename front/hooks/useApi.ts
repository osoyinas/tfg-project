import { useCallback, useState } from "react";
import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { useKeycloak } from "@/components/keycloak-provider";

interface ApiState<T> {
  data: T | null;
  error: any;
  loading: boolean;
}

export function useApi<T = any>() {
  const { keycloak, authenticated } = useKeycloak();
  const [state, setState] = useState<ApiState<T>>({ data: null, error: null, loading: false });

  const request = useCallback(
    async (config: AxiosRequestConfig): Promise<AxiosResponse<T> | undefined> => {
      setState({ data: null, error: null, loading: true });
      try {
        // Añade el token si está autenticado
        if (authenticated && keycloak.token) {
          config.headers = config.headers || {};
          config.headers["Authorization"] = `Bearer ${keycloak.token}`;
        }
        let response = await axios(config);
        setState({ data: response.data, error: null, loading: false });
        return response;
      } catch (error: any) {
        // Si es 401, intenta refrescar el token y reintenta una vez
        if (
          error.response &&
          error.response.status === 401 &&
          keycloak.refreshToken
        ) {
          try {
            await keycloak.updateToken(30);
            if (keycloak.token) {
              config.headers = config.headers || {};
              config.headers["Authorization"] = `Bearer ${keycloak.token}`;
              let retryResponse = await axios(config);
              setState({ data: retryResponse.data, error: null, loading: false });
              return retryResponse;
            }
          } catch (refreshError) {
            keycloak.logout();
          }
        }
        setState({ data: null, error, loading: false });
        return undefined;
      }
    },
    [authenticated, keycloak]
  );

  return { ...state, request };
}
