import React, { useState } from 'react';
import { BookingForm, BookingList } from './components/organisms';
import { useBookings } from './hooks/useBookings';
import { useNotification } from './contexts';
import { BookingFormData } from './types';
import { Box, Container, Typography, useTheme } from '@mui/material';
import { Button } from './components/atoms';

function App() {
  const [currentUserName, setCurrentUserName] = useState('');
  const theme = useTheme();
  const { showSuccess, showError, showInfo, showWarning } = useNotification();

  const {
    bookings,
    isLoading,
    createBooking,
    cancelBooking,
    clearError,
    isCreating,
  } = useBookings();

  const handleSubmit = async (formData: BookingFormData) => {
    setCurrentUserName(formData.employeeName);

    if (!formData.selectedDate) {
      // Return error result for validation failure
      return { success: false, error: 'Selected date is required' };
    }

    const result = await createBooking({
      employeeName: formData.employeeName,
      date: formData.selectedDate.toISOString().split('T')[0]
    });

    if (result.success) {
      showSuccess('Parking slot booked successfully!');
    }

    // Return the result so the form can determine whether to reset
    return result;
  };

  const handleCancelBooking = async (bookingId: string, employeeName: string) => {
    const result = await cancelBooking(bookingId, employeeName);

    if (result.success) {
      showSuccess('Booking cancelled successfully!');
    }
  };

  return (
    <Box 
      sx={{ 
        minHeight: '100vh',
        background: `linear-gradient(135deg, ${theme.palette.grey[50]} 0%, ${theme.palette.primary.light} 50%, ${theme.palette.secondary.light} 100%)`,
        py: { xs: 2, sm: 4 }
      }}
    >
      <Container maxWidth="xl" sx={{ px: { xs: 2, sm: 3, lg: 4 } }}>
        {/* Header */}
        <Box textAlign="center" mb={{ xs: 4, sm: 6 }}>
          <Box display="flex" alignItems="center" justifyContent="center" mb={3}>
            <Typography 
              variant="h2" 
              component="h1" 
              sx={{
                fontSize: { xs: '2.5rem', sm: '3rem', lg: '3.75rem' },
                fontWeight: 'bold',
                background: 'linear-gradient(45deg, #1e293b 30%, #1e40af 50%, #3730a3 90%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                textAlign: 'center'
              }}
            >
              Quantiful *Awesome* 1 bay parking
            </Typography>
          </Box>
          <Typography 
            variant="h6" 
            color="text.secondary" 
            sx={{ 
              maxWidth: '48rem', 
              mx: 'auto',
              fontSize: { xs: '1rem', sm: '1.25rem' }
            }}
          >
            Book your company parking space for the day. Only one slot available per day.
          </Typography>
        </Box>

        {/* Main Content Grid */}
        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: { xs: '1fr', xl: '1fr 1fr' }, 
          gap: { xs: 3, lg: 4 },
          mb: 6
        }}>
          {/* Booking Form */}
          <Box order={{ xs: 2, xl: 1 }}>
            <BookingForm
              onSubmit={handleSubmit}
              isLoading={isCreating}
            />
          </Box>

          {/* Booking List */}
          <Box order={{ xs: 1, xl: 2 }}>
            <BookingList
              bookings={bookings}
              onCancelBooking={handleCancelBooking}
              currentUserName={currentUserName}
              isLoading={isLoading}
            />
          </Box>
        </Box>

        {/* Footer */}
        <Box textAlign="center" mt={6} pt={4} sx={{ borderTop: `1px solid ${theme.palette.divider}` }}>
          <Box sx={{ 
            display: 'flex', 
            flexDirection: { xs: 'column', sm: 'row' }, 
            alignItems: 'center', 
            justifyContent: 'center', 
            gap: { xs: 2, sm: 4 },
            mb: 2
          }}>
            <Box display="flex" alignItems="center">
              <Box sx={{ width: 8, height: 8, borderRadius: '50%', background: 'linear-gradient(to right, #4ade80, #6ee7b7)' }} mr={1}></Box>
              <Typography fontWeight="medium">Available</Typography>
            </Box>
            <Box display="flex" alignItems="center">
              <Box sx={{ width: 8, height: 8, borderRadius: '50%', background: 'linear-gradient(to right, #60a5fa, #818cf8)' }} mr={1}></Box>
              <Typography fontWeight="medium">Today</Typography>
            </Box>
            <Box display="flex" alignItems="center">
              <Box sx={{ width: 8, height: 8, borderRadius: '50%', background: 'linear-gradient(to right, #6b7280, #9ca3af)' }} mr={1}></Box>
              <Typography fontWeight="medium">Past</Typography>
            </Box>
          </Box>
          <Typography color="text.secondary" mt={2}>
            Business days only (Monday-Friday) • One slot per day
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}

export default App;
