'use client';

import { Box, CircularProgress, Typography } from '@mui/material';

interface LoadingSpinnerProps {
  size?: number;
  message?: string;
}

export default function LoadingSpinner({ size = 60, message = 'Đang tải...' }: LoadingSpinnerProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      }}
    >
      <Box sx={{ position: 'relative', display: 'inline-flex' }}>
        <CircularProgress
          size={size}
          thickness={4}
          sx={{
            color: 'white',
            animation: 'pulse 2s infinite',
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <CircularProgress
            size={size * 0.8}
            thickness={3}
            sx={{
              color: 'rgba(255, 255, 255, 0.3)',
              animation: 'pulse 2s infinite reverse',
            }}
          />
        </Box>
      </Box>
      
      <Typography
        variant="h6"
        sx={{
          mt: 3,
          color: 'white',
          fontWeight: 500,
          animation: 'fadeInUp 0.8s ease-out',
        }}
      >
        {message}
      </Typography>

      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </Box>
  );
}
