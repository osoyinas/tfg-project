import axios from "axios";

// Crea una instancia de axios
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL!!,
});

export default api;
