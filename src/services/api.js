import axios from "axios";
import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const BASE_URL =
  Platform.OS === "android" ? "http://10.0.2.2:8000" : "http://localhost:8000";

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add JWT token
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem("jwt_token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.warn("Failed to retrieve JWT token:", error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Response interceptor for standardized error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Server responded with error status
      console.error(
        "API Error Response:",
        error.response.status,
        error.response.data,
      );
    } else if (error.request) {
      // Request made but no response
      console.error("API No Response:", error.request);
    } else {
      // Error in request configuration
      console.error("API Request Error:", error.message);
    }
    return Promise.reject(error);
  },
);

export const getRecords = async () => {
  try {
    const response = await api.get("/records/");
    return response.data;
  } catch (error) {
    console.error("API Error getRecords:", error);
    return [];
  }
};

export const createRecord = async (record) => {
  try {
    const response = await api.post("/records/", record);
    return response.data;
  } catch (error) {
    console.error("API Error createRecord:", error);
    throw error;
  }
};

export const getQuests = async () => {
  try {
    const response = await api.get("/rpg/quests");
    return response.data;
  } catch (error) {
    console.error("API Error getQuests:", error);
    return [];
  }
};

export const getDashboardStatus = async () => {
  try {
    const response = await api.get("/records/rpg-status");
    return response.data;
  } catch (error) {
    return null; // Handle quietly
  }
};

export default api;
