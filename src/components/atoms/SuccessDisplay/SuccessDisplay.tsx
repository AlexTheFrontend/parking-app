import React from 'react';
import { Alert, Box, IconButton } from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';

export interface SuccessDisplayProps {
  message: string;
  onClear: () => void;
  className?: string;
}

export const SuccessDisplay: React.FC<SuccessDisplayProps> = ({
  message,
  onClear,
  className = '',
}) => {
  return (
    <Box className={className}>
      <Alert 
        severity="success" 
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
        {message}
      </Alert>
    </Box>
  );
};
