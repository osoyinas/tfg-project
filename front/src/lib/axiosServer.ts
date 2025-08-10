// src/lib/axiosServer.ts
import axios from "axios";

const API_URI = process.env.API_URI || "";

export const axiosServer = axios.create({
  baseURL: API_URI,
});

// Interceptor para servidor (Node.js)
axiosServer.interceptors.request.use((config) => {
  // Aquí deberías obtener el token de la request (por ejemplo, de cookies o headers)
  // Este es un placeholder, deberás adaptar según tu lógica de SSR
  // config.headers["Authorization"] = `Bearer ${token}`;
  return config;
});
