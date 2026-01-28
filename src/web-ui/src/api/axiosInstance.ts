import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios';
import { useAuthStore } from '../store/authStore';

const API_BASE_URL = 'http://localhost:5000/api';

// Create axios instance with default config
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Flag to prevent multiple refresh token requests
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

const processQueue = (error: AxiosError | null, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Request interceptor - adds Authorization and X-Correlation-ID headers
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    
    // Add Correlation ID for tracked endpoints
    const trackedEndpoints = ['/collector/run', '/collector/ingest'];
    const shouldTrack = trackedEndpoints.some(endpoint => config.url?.includes(endpoint));
    if (shouldTrack) {
        const correlationId = crypto.randomUUID();
        
        config.params = {
            ...config.params,
            correlationId: correlationId
        };

        // Можна також лишити в Headers для Ocelot/логів, це не завадить
        config.headers['X-Correlation-ID'] = correlationId;
        
        console.log(`[Axios] Added CorrelationId to ${config.url}: ${correlationId}`);
    }

    // Add Authorization header if access token exists
    const accessToken = useAuthStore.getState().accessToken;
    if (accessToken) {
      config.headers['Authorization'] = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - handles 401 errors and token refresh
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    // Handle 401 Unauthorized errors
    if (error.response?.status === 401 && !originalRequest._retry) {
      // Skip refresh logic for the refresh endpoint itself
      if (originalRequest.url?.includes('/auth/refresh')) {
        useAuthStore.getState().logout();
        return Promise.reject(error);
      }

      if (isRefreshing) {
        // Queue the request while refresh is in progress
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers['Authorization'] = `Bearer ${token}`;
            return axiosInstance(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = useAuthStore.getState().refreshToken;

      if (!refreshToken) {
        useAuthStore.getState().logout();
        isRefreshing = false;
        return Promise.reject(error);
      }

      try {
        // Call the refresh token endpoint
        const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
          "refreshToken": refreshToken,
        });

        const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
          response.data;

        // Update tokens in the store
        useAuthStore.getState().setTokens(newAccessToken, newRefreshToken);

        // Update the Authorization header
        originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;

        // Process queued requests
        processQueue(null, newAccessToken);

        return axiosInstance(originalRequest);
      } catch (refreshError) {
        // Refresh failed - logout user
        processQueue(refreshError as AxiosError, null);
        useAuthStore.getState().logout();
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
