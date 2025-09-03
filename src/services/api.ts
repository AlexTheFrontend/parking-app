import { Booking, CreateBookingRequest, ApiResponse } from '../types';

const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? '' // Same origin in production
  : 'http://localhost:5000'; // Development server

class ApiService {
  private async request<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${API_BASE_URL}/api${endpoint}`;
    
    const defaultOptions: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    try {
      const response = await fetch(url, {
        ...defaultOptions,
        ...options,
        headers: {
          ...defaultOptions.headers,
          ...options.headers,
        },
      });

      const data: ApiResponse<T> = await response.json();
      
      if (!response.ok) {
        return {
          success: false,
          error: data.error || `HTTP ${response.status}: ${response.statusText}`,
        };
      }

      return data;
    } catch (error) {
      console.error('API request failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error occurred',
      };
    }
  }

  // Get all bookings
  async getAllBookings(): Promise<ApiResponse<Booking[]>> {
    return this.request<Booking[]>('/bookings');
  }

  // Get booking for a specific date
  async getBookingByDate(date: string): Promise<ApiResponse<Booking | null>> {
    return this.request<Booking | null>(`/bookings/${date}`);
  }

  // Create a new booking
  async createBooking(bookingData: CreateBookingRequest): Promise<ApiResponse<Booking>> {
    return this.request<Booking>('/bookings', {
      method: 'POST',
      body: JSON.stringify(bookingData),
    });
  }

  // Cancel a booking
  async cancelBooking(bookingId: string): Promise<ApiResponse<{ deleted: boolean }>> {
    return this.request<{ deleted: boolean }>(`/bookings/${bookingId}`, {
      method: 'DELETE',
    });
  }

  // Health check
  async healthCheck(): Promise<ApiResponse<{ status: string; timestamp: string; environment: string }>> {
    return this.request<{ status: string; timestamp: string; environment: string }>('/health');
  }
}

export const apiService = new ApiService();
export default apiService;