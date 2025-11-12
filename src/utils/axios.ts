import type { AxiosError, InternalAxiosRequestConfig } from 'axios';

import axios from 'axios';

import { store } from 'src/store';
import { CONFIG } from 'src/config-global';
import { logout, refreshTokenThunk } from 'src/store/slices/authSlice';

// ----------------------------------------------------------------------

const axiosInstance = axios.create({
  baseURL: `${CONFIG.apiUrl}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Important for cookies/refresh token
});

// Request interceptor - Add access token to requests
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Don't add token to refresh endpoint (backend uses refreshToken from cookie/body)
    if (config.url?.includes('/auth/refresh')) {
      return config;
    }

    const state = store.getState();
    const accessToken = state.auth.accessToken;

    if (accessToken && config.headers) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - Handle token refresh on 401
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (error?: unknown) => void;
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

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // If error is 401 and we haven't tried to refresh yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // If already refreshing, queue this request
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => (token && originalRequest.headers && (originalRequest.headers.Authorization = `Bearer ${token}`), axiosInstance(originalRequest)))
          .catch((err) => Promise.reject(err)) as Promise<any>;
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Try to refresh token
        const newAccessToken = await store.dispatch(refreshTokenThunk()).unwrap();

        processQueue(null, newAccessToken);

        // Retry original request with new token
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        }

        return axiosInstance(originalRequest);
      } catch (refreshError) {
        // Refresh failed, logout user
        processQueue(refreshError as AxiosError, null);
        store.dispatch(logout());
        window.location.href = '/sign-in';
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
