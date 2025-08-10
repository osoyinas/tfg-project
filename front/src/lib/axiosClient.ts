// src/lib/axiosClient.ts
import axios from "axios";
import { getSession } from "next-auth/react";

// Extend Session type to include accessToken
declare module "next-auth" {
  interface Session {
    accessToken?: string;
    user?: {
      accessToken?: string;
      [key: string]: any;
    };
  }
}

const API_URI = process.env.NEXT_PUBLIC_API_URI || "";

export const axiosClient = axios.create({
  baseURL: API_URI,
});

// Interceptor para cliente (browser) usando next-auth
axiosClient.interceptors.request.use(async (config) => {
  if (typeof window !== "undefined") {
    const session = await getSession();
    const token = session?.accessToken || session?.user?.accessToken;
    console.log("Axios Client Interceptor - Token:", token);
    if (token) {
      config.headers = config.headers || {};
      config.headers["Authorization"] = `Bearer ${token}`;
    }
  }
  return config;
});
