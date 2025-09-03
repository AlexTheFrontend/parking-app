import { useState, useEffect, useCallback } from 'react';
import { Booking, CreateBookingRequest } from '../types';
import { apiService } from '../services/api';
import { useNotification } from '../contexts';

interface UseBookingsReturn {
  bookings: Booking[];
  isLoading: boolean;
  createBooking: (bookingData: CreateBookingRequest) => Promise<{ success: boolean; error?: string }>;
  cancelBooking: (bookingId: string, employeeName: string) => Promise<{ success: boolean; error?: string }>;
  refreshBookings: () => Promise<void>;
  clearError: () => void;
  isCreating: boolean;
  isCancelling: boolean;
}

export const useBookings = (): UseBookingsReturn => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const { showError } = useNotification();

  const clearError = useCallback(() => {
    // This is now handled by the notification system
  }, []);

  const refreshBookings = useCallback(async () => {
    setIsLoading(true);

    try {
      const response = await apiService.getAllBookings();

      if (response.success && response.data) {
        setBookings(response.data);
      } else {
        showError(response.error || 'Failed to fetch bookings');
        setBookings([]);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      showError(errorMessage);
      setBookings([]);
    } finally {
      setIsLoading(false);
    }
  }, [showError]);

  const createBooking = useCallback(async (
    bookingData: CreateBookingRequest // eslint-disable-line @typescript-eslint/no-unused-vars
  ) => {
    setIsCreating(true);

    try {
      const response = await apiService.createBooking(bookingData);

      if (response.success && response.data) {
        // Add the new booking to the current list
        setBookings(prev => [response.data!, ...prev]);
        return { success: true };
      } else {
        const errorMsg = response.error || 'Failed to create booking';
        showError(errorMsg);
        return {
          success: false,
          error: errorMsg
        };
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      showError(errorMessage);
      return {
        success: false,
        error: errorMessage
      };
    } finally {
      setIsCreating(false);
    }
  }, [showError]);

  const cancelBooking = useCallback(async (bookingId: string, employeeName: string) => {
    setIsCancelling(true);

    try {
      const response = await apiService.cancelBooking(bookingId, employeeName);

      if (response.success && response.data?.deleted) {
        // Remove the cancelled booking from the current list
        setBookings(prev => prev.filter(booking => booking.id !== bookingId));
        return { success: true };
      } else {
        const errorMsg = response.error || 'Failed to cancel booking';
        showError(errorMsg);
        return {
          success: false,
          error: errorMsg
        };
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      showError(errorMessage);
      return {
        success: false,
        error: errorMessage
      };
    } finally {
      setIsCancelling(false);
    }
  }, [showError]);

  // Load bookings on component mount
  useEffect(() => {
    refreshBookings();
  }, [refreshBookings]);

  return {
    bookings,
    isLoading,
    createBooking,
    cancelBooking,
    refreshBookings,
    clearError,
    isCreating,
    isCancelling,
  };
};
