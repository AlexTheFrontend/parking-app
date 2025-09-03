import React, { useState } from 'react';
import {
  Paper,
  Box,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Alert
} from '@mui/material';
import { Button } from '../../atoms';
import { BookingFormData } from '../../../types';

export interface BookingFormProps {
  onSubmit: (formData: BookingFormData) => Promise<{ success: boolean; error?: string }>;
  isLoading?: boolean;
  className?: string;
}

export const BookingForm: React.FC<BookingFormProps> = ({
  onSubmit,
  isLoading = false,
  className = '',
}) => {
  const [employeeName, setEmployeeName] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [errors, setErrors] = useState<{employeeName?: string; selectedDate?: string; api?: string}>({});

  const validateForm = (): boolean => {
    const newErrors: {employeeName?: string; selectedDate?: string} = {};

    if (!employeeName.trim()) {
      newErrors.employeeName = 'Employee name is required';
    } else if (employeeName.trim().length < 2) {
      newErrors.employeeName = 'Employee name must be at least 2 characters long';
    } else if (employeeName.trim().length > 50) {
      newErrors.employeeName = 'Employee name must be 50 characters or less';
    } else if (!/^[a-zA-Z0-9\s]+$/.test(employeeName.trim())) {
      newErrors.employeeName = 'Employee name can only contain letters, numbers, and spaces';
    }

    if (!selectedDate) {
      newErrors.selectedDate = 'Booking date is required';
    } else {
      const selected = new Date(selectedDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (selected < today) {
        newErrors.selectedDate = 'Cannot book past dates';
      } else {
        // Check if it's a business day (Monday-Friday)
        const day = selected.getDay();
        if (day === 0 || day === 6) {
          newErrors.selectedDate = 'Bookings are only allowed on business days (Monday-Friday)';
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const formData: BookingFormData = {
      employeeName: employeeName.trim(),
      selectedDate: selectedDate ? new Date(selectedDate) : null,
    };

    try {
      const result = await onSubmit(formData);
      
      if (result.success) {
        // Reset form only on successful submission
        setEmployeeName('');
        setSelectedDate('');
        setErrors({});
      } else {
        // Keep form values on error, but show API error message
        setErrors({ api: result.error || 'Failed to create booking' });
      }
    } catch (error) {
      // Network or unexpected errors - keep form values
      setErrors({});
    }
  };

  const getTodayString = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  return (
    <Paper
      elevation={3}
      sx={{
        p: { xs: 4, sm: 5 },
        background: 'rgba(255, 255, 255, 0.8)',
        backdropFilter: 'blur(8px)',
        borderRadius: 4,
        border: '1px solid rgba(255, 255, 255, 0.5)',
        '&:hover': {
          boxShadow: 8,
          transition: 'all 0.3s ease'
        }
      }}
      className={className}
    >
      <Box textAlign="center" mb={{ xs: 4, sm: 5 }}>
        <Typography
          variant="h3"
          component="h2"
          sx={{
            mb: 1.5,
            background: 'linear-gradient(45deg, #1e293b 30%, #1e40af 90%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontWeight: 'bold'
          }}
        >
          Book Parking Slot
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Select your preferred date and enter your name
        </Typography>
      </Box>

      <Box component="form" onSubmit={handleSubmit}>
        <Box mb={3}>
          <TextField
            fullWidth
            label="Employee Name"
            value={employeeName}
            onChange={(e) => setEmployeeName(e.target.value)}
            error={!!errors.employeeName}
            helperText={errors.employeeName}
            placeholder="Enter your full name"
            variant="outlined"
            size="medium"
            required
            InputLabelProps={{
              shrink: true,
            }}
            sx={{ mb: 2 }}
          />
        </Box>

        <Box mb={4}>
          <TextField
            fullWidth
            label="Booking Date"
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            error={!!errors.selectedDate}
            helperText={errors.selectedDate}
            variant="outlined"
            size="medium"
            required
            InputLabelProps={{
              shrink: true,
            }}
            inputProps={{
              min: getTodayString(),
            }}
            sx={{ mb: 2 }}
          />
        </Box>

        {/* API Error Display */}
        {errors.api && (
          <Box mb={3}>
            <Alert severity="error" sx={{ width: '100%' }}>
              {errors.api}
            </Alert>
          </Box>
        )}

        <Box sx={{ width: '100%', mt: 4 }}>
          <Button
            type="submit"
            variant="primary"
            size="large"
            disabled={isLoading}
            loading={isLoading}
          >
            Book Parking
          </Button>
        </Box>
      </Box>
    </Paper>
  );
};
