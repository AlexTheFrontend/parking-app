export interface Booking {
  id: string;
  employeeName: string;
  date: string; // ISO date string (YYYY-MM-DD)
  createdAt: string; // ISO datetime string
}

export interface CreateBookingRequest {
  employeeName: string;
  date: string;
}

export interface BookingFormData {
  employeeName: string;
  selectedDate: Date | null;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export type BookingStatus = 'available' | 'booked' | 'past';

export interface CalendarDay {
  date: Date;
  status: BookingStatus;
  booking?: Booking;
}