import axios from "axios";

const isServer = typeof window === "undefined";

const isProduction = process.env.NODE_ENV === "production";

const baseURL = isProduction
  ? process.env.NEXT_PUBLIC_BASE_URL
  : (isServer ? (process.env.SERVER_BASE_URL || "http://127.0.0.1:8000/api/") : process.env.NEXT_PUBLIC_BASE_URL);

export default axios.create({
  baseURL: baseURL,
  headers: (isServer && !isProduction) ? {
    "X-Forwarded-Host": "127.0.0.1:8000"
  } : {}
});