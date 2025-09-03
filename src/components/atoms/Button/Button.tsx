import React from 'react';
import { Button as MuiButton, ButtonProps as MuiButtonProps, CircularProgress } from '@mui/material';

export interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'outline';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  className?: string;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  className = '',
}) => {
  const getMuiVariant = (): MuiButtonProps['variant'] => {
    switch (variant) {
      case 'outline':
        return 'outlined';
      case 'primary':
      case 'secondary':
      case 'danger':
      case 'success':
      default:
        return 'contained';
    }
  };

  const getMuiColor = (): MuiButtonProps['color'] => {
    switch (variant) {
      case 'danger':
        return 'error';
      case 'success':
        return 'success';
      case 'secondary':
        return 'secondary';
      case 'outline':
        return 'primary';
      case 'primary':
      default:
        return 'primary';
    }
  };

  const getMuiSize = (): MuiButtonProps['size'] => {
    switch (size) {
      case 'small':
        return 'small';
      case 'large':
        return 'large';
      case 'medium':
      default:
        return 'medium';
    }
  };

  return (
    <MuiButton
      variant={getMuiVariant()}
      color={getMuiColor()}
      size={getMuiSize()}
      onClick={onClick}
      disabled={disabled || loading}
      className={className}
      type={type}
      startIcon={loading ? <CircularProgress size={16} /> : undefined}
    >
      {children}
    </MuiButton>
  );
};
