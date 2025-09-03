import React from 'react';
import {
  Paper,
  Box,
  Typography,
  CircularProgress,
  Alert
} from '@mui/material';
import { BookingCard } from '../BookingCard';
import { Booking } from '../../../types';

export interface BookingListProps {
  bookings: Booking[];
  onCancelBooking?: (bookingId: string, employeeName: string) => void;
  currentUserName?: string;
  isLoading?: boolean;
  className?: string;
}

export const BookingList: React.FC<BookingListProps> = ({
  bookings,
  onCancelBooking,
  currentUserName,
  isLoading = false,
  className = '',
}) => {
  if (isLoading) {
    return (
      <Paper
        elevation={3}
        sx={{
          p: { xs: 4, sm: 5 },
          background: 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(8px)',
          borderRadius: 4,
          border: '1px solid rgba(255, 255, 255, 0.5)'
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
            Current Bookings
          </Typography>
        </Box>
        <Box textAlign="center" py={8}>
          <CircularProgress size={48} sx={{ mb: 3 }} />
          <Typography variant="h6" color="text.secondary" fontWeight="medium">
            Loading bookings...
          </Typography>
        </Box>
      </Paper>
    );
  }

  if (bookings.length === 0) {
    return (
      <Paper
        elevation={3}
        sx={{
          p: { xs: 4, sm: 5 },
          background: 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(8px)',
          borderRadius: 4,
          border: '1px solid rgba(255, 255, 255, 0.5)'
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
            Current Bookings
          </Typography>
        </Box>
        <Box textAlign="center" py={8}>
          <Typography variant="h4" component="h3" sx={{ mb: 2, fontWeight: 'bold' }}>
            No bookings yet
          </Typography>
          <Typography variant="h6" color="text.secondary">
            The parking slot is available for booking!
          </Typography>
        </Box>
      </Paper>
    );
  }

  // Sort bookings by date (newest first)
  const sortedBookings = [...bookings].sort((a, b) =>
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const activeBookings = sortedBookings.filter(booking =>
    new Date(booking.date) >= today
  );

  const pastBookings = sortedBookings.filter(booking =>
    new Date(booking.date) < today
  );

  return (
    <Paper
      elevation={3}
      sx={{
        p: { xs: 4, sm: 5 },
        background: 'rgba(255, 255, 255, 0.8)',
        backdropFilter: 'blur(8px)',
        borderRadius: 4,
        border: '1px solid rgba(255, 255, 255, 0.5)'
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
          Parking Bookings
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage your parking reservations
        </Typography>
      </Box>

      {activeBookings.length > 0 && (
        <Box mb={5}>
          <Box display="flex" alignItems="center" mb={3}>
            <Box
              sx={{
                width: 16,
                height: 16,
                borderRadius: '50%',
                background: 'linear-gradient(45deg, #4ade80 30%, #10b981 90%)',
                mr: 2,
                boxShadow: '0 4px 8px rgba(74, 222, 128, 0.3)'
              }}
            />
            <Typography variant="h5" component="h3" fontWeight="bold">
              Active Bookings ({activeBookings.length})
            </Typography>
          </Box>
          <Box sx={{ '& > *:not(:last-child)': { mb: 3 } }}>
            {activeBookings.map((booking) => (
              <BookingCard
                key={booking.id}
                booking={booking}
                onCancel={onCancelBooking}
                currentUserName={currentUserName}
              />
            ))}
          </Box>
        </Box>
      )}

      {pastBookings.length > 0 && (
        <Box>
          <Box display="flex" alignItems="center" mb={3}>
            <Box
              sx={{
                width: 16,
                height: 16,
                borderRadius: '50%',
                background: 'linear-gradient(45deg, #94a3b8 30%, #6b7280 90%)',
                mr: 2,
                boxShadow: '0 4px 8px rgba(148, 163, 184, 0.3)'
              }}
            />
            <Typography variant="h5" component="h3" fontWeight="bold">
              Past Bookings ({pastBookings.length})
            </Typography>
          </Box>
          <Box sx={{ '& > *:not(:last-child)': { mb: 3 } }}>
            {pastBookings.map((booking) => (
              <BookingCard
                key={booking.id}
                booking={booking}
                onCancel={onCancelBooking}
                currentUserName={currentUserName}
              />
            ))}
          </Box>
        </Box>
      )}
    </Paper>
  );
};
