import React from 'react';
import {
  Paper,
  Box,
  Typography,
  Chip,
  Alert
} from '@mui/material';
import { Button } from '../../atoms';
import { Booking } from '../../../types';

export interface BookingCardProps {
  booking: Booking;
  onCancel?: (bookingId: string, employeeName: string) => void;
  currentUserName?: string;
  className?: string;
}

export const BookingCard: React.FC<BookingCardProps> = ({
  booking,
  onCancel,
  currentUserName,
  className = '',
}) => {
  const canCancel = currentUserName === booking.employeeName;
  const bookingDate = new Date(booking.date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const isPastDate = bookingDate < today;
  const isToday = bookingDate.getTime() === today.getTime();
  const canCancelBooking = canCancel && !isPastDate && !isToday;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getStatusInfo = () => {
    if (isPastDate) {
      return { text: 'Past', color: 'default' as const };
    }
    if (isToday) {
      return { text: 'Today', color: 'primary' as const };
    }
    return { text: 'Active', color: 'success' as const };
  };

  const statusInfo = getStatusInfo();

  return (
    <Paper
      elevation={2}
      sx={{
        p: { xs: 3, sm: 4 },
        background: 'rgba(255, 255, 255, 0.9)',
        backdropFilter: 'blur(8px)',
        borderRadius: 3,
        borderLeft: `4px solid ${isPastDate ? '#9ca3af' : '#3b82f6'}`,
        opacity: isPastDate ? 0.8 : 1,
        '&:hover': {
          boxShadow: 4,
          transition: 'all 0.3s ease'
        }
      }}
      className={className}
    >
      <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={{ xs: 2, sm: 3 }}>
        <Box flex={1}>
          <Typography
            variant="h5"
            component="h3"
            sx={{
              mb: 1.5,
              background: 'linear-gradient(45deg, #1e293b 30%, #1e40af 90%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontWeight: 'bold'
            }}
          >
            {booking.employeeName}
          </Typography>
          <Box display="flex" alignItems="center" sx={{ mb: 1 }}>
            <Typography color="primary" sx={{ mr: 1.5 }}>📅</Typography>
            <Typography color="text.secondary">
              {formatDate(booking.date)}
            </Typography>
          </Box>
        </Box>
        <Box display="flex" flexDirection="column" alignItems="flex-end">
          <Chip
            label={statusInfo.text}
            color={statusInfo.color}
            size="small"
            sx={{ mb: 1.5 }}
          />
        </Box>
      </Box>

      <Box display="flex" alignItems="center" mb={3}>
        <Typography color="text.secondary" sx={{ mr: 1.5 }}>⏰</Typography>
        <Typography color="text.secondary">
          Booked on {new Date(booking.createdAt).toLocaleDateString()}
        </Typography>
      </Box>

      {canCancelBooking && onCancel && (
        <Box display="flex" justifyContent="flex-end">
          <Button
            onClick={() => onCancel(booking.id, booking.employeeName)}
            variant="danger"
            size="small"
          >
            Cancel Booking
          </Button>
        </Box>
      )}

      {!canCancelBooking && canCancel && (
        <Alert severity="info" sx={{ textAlign: 'center' }}>
          {isToday ? 'Cannot cancel today\'s booking' : 'Cannot cancel past bookings'}
        </Alert>
      )}
    </Paper>
  );
};
