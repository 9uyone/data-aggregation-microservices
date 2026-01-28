import { GoogleLogin, type CredentialResponse } from '@react-oauth/google';
import { Alert } from '@mui/material';
import { useState } from 'react';
import { authApi } from '../../api/authApi';
import { useAuthStore } from '../../store/authStore';
import { jwtDecode } from 'jwt-decode';

interface GoogleUser {
  sub: string;
  email: string;
  name: string;
  picture?: string;
}

export const GoogleLoginButton: React.FC = () => {
  const [error, setError] = useState<string | null>(null);
  const { login } = useAuthStore();

  const handleSuccess = async (credentialResponse: CredentialResponse) => {
    setError(null);

    try {
      const idToken = credentialResponse.credential;
      
      if (!idToken) {
        throw new Error('No ID token received from Google');
      }

      // Decode ID token to get user info
      const decodedToken = jwtDecode<GoogleUser>(idToken);

      // Send ID token to backend for authentication
      const { accessToken, refreshToken } = await authApi.googleAuth(idToken);

      // Create user object from decoded ID token
      const user = {
        id: decodedToken.sub,
        email: decodedToken.email,
        name: decodedToken.name,
        avatarUrl: decodedToken.picture,
      };

      login(user, accessToken, refreshToken);
    } catch (err) {
      console.error('Google login error:', err);
      setError(
        err instanceof Error ? err.message : 'Failed to authenticate with Google'
      );
    }
  };

  const handleError = () => {
    console.error('Google login failed');
    setError('Google login was cancelled or failed');
  };

  return (
    <>
      <GoogleLogin
        onSuccess={handleSuccess}
        onError={handleError}
        useOneTap
        size="large"
        width="400"
        logo_alignment="left"
      />

      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}
    </>
  );
};

export default GoogleLoginButton;

