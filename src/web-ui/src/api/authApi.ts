import axiosInstance from './axiosInstance';

interface GoogleAuthRequest {
  idToken: string;
}

interface AuthResponse {
  accessToken: string;
  refreshToken: string;
}

/**
 * Authenticate user with Google ID Token
 */
export const googleAuth = async (idToken: string): Promise<AuthResponse> => {
  const response = await axiosInstance.post<AuthResponse>(
    '/auth/google',
    { idToken } as GoogleAuthRequest
  );
  return response.data;
};

export const authApi = {
  googleAuth,
};

export default authApi;
