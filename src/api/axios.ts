import axios from "axios";
import { getFromLocalStorage } from "../constant/utils";

export const apiClient = axios.create({
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use((config) => {
  const token = getFromLocalStorage("token"); // Lấy token từ localStorage
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const FileClient = axios.create({
  headers: {
    "Content-Type": "multipart/form-data",
  },
});

FileClient.interceptors.request.use((config) => {
  const token = getFromLocalStorage("token"); // Lấy token từ localStorage
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
