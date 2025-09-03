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

// New parking session types
export type ParkingFlowStep = 'location' | 'datetime' | 'duration' | 'confirmation' | 'active' | 'summary';

export interface ParkingSession {
  id: string;
  employeeName: string;
  startTime: string;
  endTime?: string;
  scheduledStartTime?: string; // ISO datetime for future bookings
  location: ParkingLocation;
  vehicle: Vehicle;
  cost: number;
  status: 'scheduled' | 'active' | 'completed' | 'cancelled';
  tokensUsed: number;
  duration?: ParkingDuration;
  isPriority: boolean;
}

export interface ParkingLocation {
  name: string;
  address: string;
  availableSpaces: number;
  pricing: PricingInfo;
  closingTime: string;
}

export interface PricingInfo {
  hourlyRate: number;
  maxDailyRate: number;
  processingFee?: number;
}

export interface Vehicle {
  type: 'car' | 'motorcycle' | 'van';
  licensePlate?: string;
}

export interface PaymentMethod {
  type: 'card';
  last4: string;
}

// Token system types
export interface TokenBalance {
  userId: string;
  currentTokens: number;
  totalTokens: number;
  weekStartDate: string; // ISO date string for Saturday
  weekEndDate: string;   // Following Friday
}

export interface ParkingDuration {
  hours: number;
  tokens: number;
  label: string;
}

export interface TokenTransaction {
  id: string;
  userId: string;
  type: 'spend' | 'refill';
  tokens: number;
  timestamp: string;
  description: string;
  sessionId?: string;
}

// Pre-defined parking durations
export const PARKING_DURATIONS: ParkingDuration[] = [
  { hours: 3, tokens: 1, label: '3 hours' },
  { hours: 6, tokens: 2, label: '6 hours' },
  { hours: 9, tokens: 3, label: '9 hours' }
];

export const PRIORITY_PARKING_TOKENS = 5;

// Date/Time selection types for future booking
export interface DateTimeSelection {
  date: Date;
  startTime: string; // HH:mm format
}

export interface TimeSlot {
  time: string; // HH:mm format
  label: string; // Display label like "9:00 AM"
  available: boolean;
}
