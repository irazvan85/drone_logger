// API client service for backend communication
import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig, AxiosResponse } from "axios";

/**
 * API response wrapper structure
 */
export interface APIResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  error_code?: string;
  message?: string;
}

/**
 * Create axios instance with base configuration
 */
const apiClient: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL as string || "http://localhost:8000/api/v1",
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Request interceptor for logging and adding auth tokens
 */
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Add auth token if available
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Log request in development
    if (import.meta.env.DEV) {
      console.debug(`[API Request] ${config.method?.toUpperCase()} ${config.url}`, config);
    }

    return config;
  },
  (error: AxiosError) => {
    console.error("[API Request Error]", error);
    return Promise.reject(error);
  }
);

/**
 * Response interceptor for error handling and logging
 */
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    // Log successful response in development
    if (import.meta.env.DEV) {
      console.debug(`[API Response] ${response.status} ${response.config.url}`, response.data);
    }

    return response;
  },
  (error: AxiosError<APIResponse>) => {
    // Log error response
    console.error("[API Response Error]", error.response?.status, error.response?.data);

    // Handle specific error statuses
    if (error.response?.status === 401) {
      // Unauthorized - clear auth and redirect to login
      localStorage.removeItem("authToken");
      window.location.href = "/login";
    } else if (error.response?.status === 403) {
      // Forbidden
      console.warn("Access denied to this resource");
    }

    return Promise.reject(error);
  }
);

/**
 * Generic GET request
 */
export async function get<T = unknown>(url: string): Promise<APIResponse<T>> {
  try {
    const response = await apiClient.get<APIResponse<T>>(url);
    return response.data;
  } catch (error) {
    throw handleAPIError(error);
  }
}

/**
 * Generic POST request
 */
export async function post<T = unknown>(url: string, data?: unknown): Promise<APIResponse<T>> {
  try {
    const response = await apiClient.post<APIResponse<T>>(url, data);
    return response.data;
  } catch (error) {
    throw handleAPIError(error);
  }
}

/**
 * Generic PUT request
 */
export async function put<T = unknown>(url: string, data?: unknown): Promise<APIResponse<T>> {
  try {
    const response = await apiClient.put<APIResponse<T>>(url, data);
    return response.data;
  } catch (error) {
    throw handleAPIError(error);
  }
}

/**
 * Generic PATCH request
 */
export async function patch<T = unknown>(url: string, data?: unknown): Promise<APIResponse<T>> {
  try {
    const response = await apiClient.patch<APIResponse<T>>(url, data);
    return response.data;
  } catch (error) {
    throw handleAPIError(error);
  }
}

/**
 * Generic DELETE request
 */
export async function delete_<T = unknown>(url: string): Promise<APIResponse<T>> {
  try {
    const response = await apiClient.delete<APIResponse<T>>(url);
    return response.data;
  } catch (error) {
    throw handleAPIError(error);
  }
}

/**
 * Upload files with FormData
 */
export async function upload<T = unknown>(url: string, formData: FormData): Promise<APIResponse<T>> {
  try {
    const response = await apiClient.post<APIResponse<T>>(url, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    throw handleAPIError(error);
  }
}

/**
 * API error class
 */
export class APIError extends Error {
  constructor(
    public message: string,
    public status?: number,
    public errorCode?: string,
    public originalError?: unknown
  ) {
    super(message);
    this.name = "APIError";
  }
}

/**
 * Handle API errors with consistent error structure
 */
function handleAPIError(error: unknown): APIError {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status;
    const data = error.response?.data as APIResponse;

    const message = data?.message || data?.error || error.message || "An error occurred";
    const errorCode = data?.error_code || `HTTP_${status}`;

    return new APIError(message, status, errorCode, error);
  }

  if (error instanceof Error) {
    return new APIError(error.message, 500, "UNKNOWN_ERROR", error);
  }

  return new APIError("An unexpected error occurred", 500, "UNKNOWN_ERROR", error);
}

/**
 * Set authentication token
 */
export function setAuthToken(token: string): void {
  localStorage.setItem("authToken", token);
  apiClient.defaults.headers.common.Authorization = `Bearer ${token}`;
}

/**
 * Clear authentication token
 */
export function clearAuthToken(): void {
  localStorage.removeItem("authToken");
  delete apiClient.defaults.headers.common.Authorization;
}

export default apiClient;
