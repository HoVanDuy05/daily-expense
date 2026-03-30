'use client';

import { useState, useEffect } from 'react';
import { Button, Box, Typography, Snackbar } from '@mui/material';
import { IconDownload, IconX } from '@tabler/icons-react';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export default function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showInstallButton, setShowInstallButton] = useState(false);
  const [showSnackbar, setShowSnackbar] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowInstallButton(true);
    };

    const handleAppInstalled = () => {
      setShowInstallButton(false);
      setDeferredPrompt(null);
      setShowSnackbar(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      setShowInstallButton(false);
    }
    
    setDeferredPrompt(null);
  };

  const handleCloseSnackbar = () => {
    setShowSnackbar(false);
  };

  if (!showInstallButton) return null;

  return (
    <>
      <Box
        sx={{
          position: 'fixed',
          bottom: 80,
          left: 16,
          right: 16,
          zIndex: 1100,
          bgcolor: 'background.paper',
          borderRadius: 2,
          p: 2,
          boxShadow: 3,
          display: 'flex',
          alignItems: 'center',
          gap: 2,
        }}
      >
        <IconDownload size={24} color="#1976d2" />
        <Box sx={{ flex: 1 }}>
          <Typography variant="subtitle2" fontWeight={600}>
            Cài đặt Daily Expense
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Cài đặt ứng dụng để trải nghiệm tốt hơn
          </Typography>
        </Box>
        <Button
          variant="contained"
          size="small"
          onClick={handleInstallClick}
          sx={{ minWidth: 80 }}
        >
          Cài đặt
        </Button>
        <Button
          size="small"
          onClick={() => setShowInstallButton(false)}
          sx={{ minWidth: 'auto', p: 1 }}
        >
          <IconX size={18} />
        </Button>
      </Box>

      <Snackbar
        open={showSnackbar}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        message="Ứng dụng đã được cài đặt thành công!"
        sx={{ bottom: 80 }}
      />
    </>
  );
}
