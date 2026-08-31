import axios from "axios";

const isServer = typeof window === "undefined";
const baseURL = isServer 
    ? "http://backend:8000/api/" 
    : process.env.NEXT_PUBLIC_BASE_URL;

export default axios.create({
    baseURL: baseURL,
    headers: isServer ? {
        "X-Forwarded-Host": "127.0.0.1:8000"
    } : {}
});
