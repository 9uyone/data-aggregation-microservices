import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { darkTheme } from './theme/theme';
import { MainLayout } from './components/layout';
import { ParserList } from './features/parsers';
import { LoginPage } from './features/auth';
import { useAuthStore } from './store/authStore';
import { googleConfig } from './config/google';
import { Box, Typography } from '@mui/material';

// Create a client for TanStack Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  const { isAuthenticated } = useAuthStore();

  return (
    <GoogleOAuthProvider clientId={googleConfig.clientId}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider theme={darkTheme}>
          <CssBaseline />
          {!isAuthenticated ? (
            <LoginPage />
          ) : (
            <MainLayout>
              <Box sx={{ mb: 4 }}>
                <Typography variant="h4" fontWeight={700} gutterBottom>
                  Dashboard
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Welcome to the Data Aggregation System
                </Typography>
              </Box>
              <ParserList />
            </MainLayout>
          )}
        </ThemeProvider>
      </QueryClientProvider>
    </GoogleOAuthProvider>
  );
}

export default App;
