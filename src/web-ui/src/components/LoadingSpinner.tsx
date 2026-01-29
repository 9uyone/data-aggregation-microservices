import { Backdrop, CircularProgress, Typography } from '@mui/material';

interface LoadingSpinnerProps {
  message?: string;
}

/**
 * Full-screen loading indicator used during app initialization.
 */
export const LoadingSpinner = ({ message = 'Loading...' }: LoadingSpinnerProps) => {
  return (
    <Backdrop
      open
      sx={{
        bgcolor: 'background.default',
        flexDirection: 'column',
        gap: 2,
      }}
    >
      <CircularProgress size={48} />
      <Typography color="text.secondary">{message}</Typography>
    </Backdrop>
  );
};

export default LoadingSpinner;
