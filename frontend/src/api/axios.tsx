import axios from "axios";
const BASE_URL: string = import.meta.env.VITE_API_URL;

// axios set up for requests that don't require auth
export default axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

// axios set up for requests that require auth
export const axiosPrivate = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});
