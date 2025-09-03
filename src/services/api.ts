import { Booking, CreateBookingRequest, ApiResponse } from '../types';

const API_BASE_URL = process.env.NODE_ENV === 'production'
  ? '' // Same origin in production
  : 'http://localhost:5001'; // Development server

class ApiService {
  private defaultOptions: {
    headers: {
      'Content-Type': string;
    };
  } = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  private async request<T>(
    endpoint: string,
    options: {
      method?: string;
      body?: string;
      headers?: Record<string, string>;
    } = {}
  ): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...this.defaultOptions,
        ...options,
      });

      const data = await response.json();
      return data;
    } catch (error) {
      // Handle network errors silently
      return {
        success: false,
        error: 'Network error occurred'
      };
    }
  }

  // Get all bookings
  async getAllBookings(): Promise<ApiResponse<Booking[]>> {
    return this.request<Booking[]>('/api/bookings');
  }

  // Get booking for a specific date
  async getBookingByDate(date: string): Promise<ApiResponse<Booking | null>> {
    return this.request<Booking | null>(`/api/bookings/${date}`);
  }

  // Create a new booking
  async createBooking(bookingData: CreateBookingRequest): Promise<ApiResponse<Booking>> {
    return this.request<Booking>('/api/bookings', {
      method: 'POST',
      body: JSON.stringify(bookingData),
    });
  }

  // Cancel a booking
  async cancelBooking(bookingId: string, employeeName: string): Promise<ApiResponse<{ deleted: boolean }>> {
    return this.request<{ deleted: boolean }>(`/api/bookings/${bookingId}`, {
      method: 'DELETE',
      body: JSON.stringify({ employeeName }),
    });
  }

  // Health check
  async healthCheck(): Promise<ApiResponse<{ status: string; timestamp: string; environment: string }>> {
    return this.request<{ status: string; timestamp: string; environment: string }>('/api/health');
  }
}

export const apiService = new ApiService();
export default apiService;
