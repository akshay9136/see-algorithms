import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button
} from '@mui/material';

export default function useDialog() {
  const [config, setConfig] = useState({
    open: false,
    title: '',
    message: '',
    variant: 'info',
  });

  const showDialog = (props) => {
    setConfig({ open: true, ...props });
  };

  const hideDialog = () => {
    setConfig((prev) => ({ ...prev, open: false }));
  };

  const colors = {
    info: 'info.main',
    success: 'success.main',
    warning: 'warning.main',
    error: 'error.main',
  };

  const dialog = (
    <Dialog open={config.open} onClose={hideDialog} fullWidth maxWidth="sm">
      <DialogTitle sx={{ color: colors[config.variant] }}>
        {config.title}
      </DialogTitle>
      <DialogContent>
        <DialogContentText>{config.message}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={hideDialog}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );

  return { dialog, showDialog };
}
