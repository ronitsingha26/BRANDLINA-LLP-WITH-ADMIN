import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5001";
const ADMIN_TOKEN_KEY = "brandlina_admin_token";
const EMPLOYEE_TOKEN_KEY = "brandlina_employee_token";

function getFromStorage(key) {
  if (typeof window === "undefined") {
    return "";
  }

  return window.localStorage.getItem(key) || "";
}

function setInStorage(key, value) {
  if (typeof window === "undefined") {
    return;
  }

  if (!value) {
    window.localStorage.removeItem(key);
    return;
  }

  window.localStorage.setItem(key, value);
}

function attachAuthHeader(client, tokenGetter) {
  client.interceptors.request.use((config) => {
    const token = tokenGetter();

    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  });
}

export function getAdminToken() {
  return getFromStorage(ADMIN_TOKEN_KEY);
}

export function setAdminToken(value) {
  setInStorage(ADMIN_TOKEN_KEY, value);
}

export function clearAdminToken() {
  setInStorage(ADMIN_TOKEN_KEY, "");
}

export function getEmployeeToken() {
  return getFromStorage(EMPLOYEE_TOKEN_KEY);
}

export function setEmployeeToken(value) {
  setInStorage(EMPLOYEE_TOKEN_KEY, value);
}

export function clearEmployeeToken() {
  setInStorage(EMPLOYEE_TOKEN_KEY, "");
}

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const adminApiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const employeeApiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

attachAuthHeader(adminApiClient, getAdminToken);
attachAuthHeader(employeeApiClient, getEmployeeToken);

export { API_BASE_URL };
