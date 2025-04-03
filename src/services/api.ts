import axios from "axios";
import { env } from "next-runtime-env";

const api = axios.create({
    baseURL: env("NEXT_PUBLIC_BASE_URL"),
});

export default api;
