import axiosInstance from 'src/utils/axios';

// ----------------------------------------------------------------------

export type LoginRequest = {
  username?: string;
  email?: string;
  password: string;
};

export type LoginResponse = {
  user: {
    id: string;
    username?: string;
    fullname?: string;
    email?: string;
    role: string;
    [key: string]: any;
  };
  accessToken: string;
  refreshToken: string;
};

export type RefreshTokenResponse = {
  accessToken: string;
};

// ----------------------------------------------------------------------

export const authService = {
  /**
   * Login user
   */
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    const response = await axiosInstance.post<LoginResponse>('/auth/login', credentials);
    return response.data;
  },

  /**
   * Refresh access token
   * Backend should get refreshToken from cookie or request body
   */
  refreshAccessToken: async (): Promise<RefreshTokenResponse> => {
    // Try to get refreshToken from localStorage as fallback
    const refreshToken = localStorage.getItem('refreshToken');
    const response = await axiosInstance.post<RefreshTokenResponse>(
      '/auth/refresh',
      refreshToken ? { refreshToken } : undefined
    );
    return response.data;
  },

  /**
   * Logout user
   */
  logout: async (): Promise<void> => {
    await axiosInstance.post('/auth/logout');
  },
};

