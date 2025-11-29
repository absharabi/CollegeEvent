import axios from "axios";

// Create an axios instance
const api = axios.create({
  // Use your backend's URL from environment variables or hardcode for development
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:5000/api",
});

export default api;