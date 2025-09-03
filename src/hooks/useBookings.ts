import { useState, useEffect, useCallback } from 'react';
import { Booking, CreateBookingRequest } from '../types';
import { apiService } from '../services/api';

interface UseBookingsReturn {
  bookings: Booking[];
  isLoading: boolean;
  error: string | null;
  createBooking: (bookingData: CreateBookingRequest) => Promise<{ success: boolean; error?: string }>;
  cancelBooking: (bookingId: string) => Promise<{ success: boolean; error?: string }>;
  refreshBookings: () => Promise<void>;
}

export const useBookings = (): UseBookingsReturn => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshBookings = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await apiService.getAllBookings();
      
      if (response.success && response.data) {
        setBookings(response.data);
      } else {
        setError(response.error || 'Failed to fetch bookings');
        setBookings([]);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(errorMessage);
      setBookings([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createBooking = useCallback(async (bookingData: CreateBookingRequest) => {
    try {
      const response = await apiService.createBooking(bookingData);
      
      if (response.success && response.data) {
        // Add the new booking to the current list
        setBookings(prev => [response.data!, ...prev]);
        return { success: true };
      } else {
        return { 
          success: false, 
          error: response.error || 'Failed to create booking' 
        };
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      return { success: false, error: errorMessage };
    }
  }, []);

  const cancelBooking = useCallback(async (bookingId: string) => {
    try {
      const response = await apiService.cancelBooking(bookingId);
      
      if (response.success) {
        // Remove the booking from the current list
        setBookings(prev => prev.filter(booking => booking.id !== bookingId));
        return { success: true };
      } else {
        return { 
          success: false, 
          error: response.error || 'Failed to cancel booking' 
        };
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      return { success: false, error: errorMessage };
    }
  }, []);

  // Load bookings on component mount
  useEffect(() => {
    refreshBookings();
  }, [refreshBookings]);

  return {
    bookings,
    isLoading,
    error,
    createBooking,
    cancelBooking,
    refreshBookings,
  };
};