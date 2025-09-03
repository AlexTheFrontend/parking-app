import React from 'react';
import { Alert, Box, IconButton } from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';

export interface ErrorDisplayProps {
  error: string;
  onClear: () => void;
  className?: string;
}

export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({
  error,
  onClear,
  className = '',
}) => {
  return (
    <Box className={className}>
      <Alert 
        severity="error" 
        onClose={onClear}
        action={
          <IconButton
            aria-label="close"
            color="inherit"
            size="small"
            onClick={onClear}
          >
            <CloseIcon fontSize="inherit" />
          </IconButton>
        }
        sx={{
          '& .MuiAlert-message': {
            width: '100%'
          }
        }}
      >
        {error}
      </Alert>
    </Box>
  );
};
