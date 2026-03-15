import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const axiosSecure = axios.create({
  baseURL: process.env.RPS_API_BASE_URL,
  headers: {
    Authorization: `Bearer ${process.env.RPS_API_TOKEN}`,
  },
  timeout: 5000
});

export default axiosSecure;