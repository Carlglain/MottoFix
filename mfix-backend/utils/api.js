import axios from "axios";

const api = axios.create({
  baseURL: "http://169.254.191.28:3000", // Replace with IP 
  headers: {
    "Content-Type": "application/json"
  }
});

export default api;
