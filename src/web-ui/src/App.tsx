import { useEffect } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline, Box, Typography } from '@mui/material';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { Routes, Route, Navigate } from 'react-router-dom';
import { darkTheme } from './theme/theme';
import { MainLayout } from './components/layout';
import { LoadingSpinner } from './components';
import { ParserList } from './features/parsers';
import { LoginPage } from './features/auth';
import { useAuthStore } from './store/authStore';
import { googleConfig } from './config/google';
import axiosInstance from './api/axiosInstance';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

/**
 * Root application component.
 *
 * Why: Centralizes initialization, auth-aware routing, and global providers
 * so the UI renders only after authentication state is stable.
 */
function App() {
  const {
    isAuthenticated,
    isInitialized,
    setUser,
    setInitialized,
    logout,
    hydrateAccessToken,
  } = useAuthStore();

  // On app start: sync access token (sessionStorage) and user profile
  useEffect(() => {
    /**
     * Bootstraps authentication state on first render.
     *
     * Why: Hydrates the access token from sessionStorage (prevents unnecessary
     * refresh calls on F5) and refreshes the user profile from /auth/me.
     */
    const initialize = async () => {
      // Ensure we restore the session-scoped access token before fetching profile
      hydrateAccessToken();

      if (!isAuthenticated) {
        setInitialized(true);
        return;
      }

      try {
        // If the access token survived in sessionStorage, /auth/me will succeed without refresh
        const { data } = await axiosInstance.get('/auth/me');
        setUser(data);
      } catch {
        // Token refresh failed - clear auth state and show login
        logout();
      } finally {
        // Mark initialization complete regardless of outcome
        setInitialized(true);
      }
    };

    initialize();
  }, []);

  // Loading state while initializing authenticated session
  if (isAuthenticated && !isInitialized) {
    return (
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <LoadingSpinner message="Loading..." />
      </ThemeProvider>
    );
  }

  return (
    <GoogleOAuthProvider clientId={googleConfig.clientId}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider theme={darkTheme}>
          <CssBaseline />
          <Routes>
            <Route
              path="/login"
              element={
                isAuthenticated ? <Navigate to="/" replace /> : <LoginPage />
              }
            />
            <Route
              path="/*"
              element={
                isAuthenticated ? (
                  <MainLayout>
                    <Box sx={{ mb: 4 }}>
                      <Typography variant="h4" fontWeight={700} gutterBottom>
                        Dashboard
                      </Typography>
                      <Typography color="text.secondary">
                        Welcome to the Data Aggregation System
                      </Typography>
                    </Box>
                    <ParserList />
                  </MainLayout>
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
          </Routes>
        </ThemeProvider>
      </QueryClientProvider>
    </GoogleOAuthProvider>
  );
}

export default App;
