import { Router, Request, Response } from 'express';
import Database, { CreateBookingRequest } from '../models/database';

const router = Router();
const db = new Database();

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// Enhanced validation functions
function isValidDate(dateString: string): boolean {
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  if (!regex.test(dateString)) return false;
  
  const date = new Date(dateString);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  return date >= today && !isNaN(date.getTime());
}

function isValidEmployeeName(name: string): boolean {
  // Employee name should be 2-50 characters, alphanumeric + spaces
  const regex = /^[a-zA-Z0-9\s]{2,50}$/;
  return regex.test(name.trim());
}

function isBusinessDay(dateString: string): boolean {
  const date = new Date(dateString);
  const day = date.getDay();
  // 0 = Sunday, 6 = Saturday
  return day !== 0 && day !== 6;
}

// GET /api/bookings - Get all bookings
router.get('/', async (req: Request, res: Response) => {
  try {
    const bookings = await db.getAllBookings();
    const response: ApiResponse<typeof bookings> = {
      success: true,
      data: bookings
    };
    return res.json(response);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    const response: ApiResponse<never> = {
      success: false,
      error: 'Failed to fetch bookings'
    };
    return res.status(500).json(response);
  }
});

// GET /api/bookings/:date - Get booking for specific date
router.get('/:date', async (req: Request, res: Response) => {
  try {
    const { date } = req.params;
    
    if (!date || !isValidDate(date)) {
      const response: ApiResponse<never> = {
        success: false,
        error: 'Invalid date format. Use YYYY-MM-DD and date must be today or in the future'
      };
      return res.status(400).json(response);
    }

    const booking = await db.getBookingByDate(date);
    const response: ApiResponse<typeof booking> = {
      success: true,
      data: booking
    };
    return res.json(response);
  } catch (error) {
    console.error('Error fetching booking:', error);
    const response: ApiResponse<never> = {
      success: false,
      error: 'Failed to fetch booking'
    };
    return res.status(500).json(response);
  }
});

// POST /api/bookings - Create new booking
router.post('/', async (req: Request, res: Response) => {
  try {
    const { employeeName, date }: CreateBookingRequest = req.body;

    // Enhanced validation
    if (!employeeName || !employeeName.trim()) {
      const response: ApiResponse<never> = {
        success: false,
        error: 'Employee name is required'
      };
      return res.status(400).json(response);
    }

    if (!isValidEmployeeName(employeeName)) {
      const response: ApiResponse<never> = {
        success: false,
        error: 'Employee name must be 2-50 characters long and contain only letters, numbers, and spaces'
      };
      return res.status(400).json(response);
    }

    if (!date || !isValidDate(date)) {
      const response: ApiResponse<never> = {
        success: false,
        error: 'Valid date is required (YYYY-MM-DD, must be today or in the future)'
      };
      return res.status(400).json(response);
    }

    // Business rule: Only allow business day bookings
    if (!isBusinessDay(date)) {
      const response: ApiResponse<never> = {
        success: false,
        error: 'Bookings are only allowed on business days (Monday-Friday)'
      };
      return res.status(400).json(response);
    }

    // Check if date is already booked
    const existingBooking = await db.getBookingByDate(date);
    if (existingBooking) {
      const response: ApiResponse<never> = {
        success: false,
        error: 'This date is already booked'
      };
      return res.status(409).json(response);
    }

    // Check if employee already has a booking within 7 days
    const employeeBookings = await db.getBookingsByEmployee(employeeName.trim());
    const hasRecentBooking = employeeBookings.some(booking => {
      const bookingDate = new Date(booking.date);
      const newDate = new Date(date);
      const diffTime = Math.abs(newDate.getTime() - bookingDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays <= 7;
    });

    if (hasRecentBooking) {
      const response: ApiResponse<never> = {
        success: false,
        error: 'You already have a booking within 7 days. Please wait before booking again.'
      };
      return res.status(400).json(response);
    }

    // Create booking
    const newBooking = await db.createBooking({
      employeeName: employeeName.trim(),
      date
    });

    const response: ApiResponse<typeof newBooking> = {
      success: true,
      data: newBooking
    };
    return res.status(201).json(response);
  } catch (error) {
    console.error('Error creating booking:', error);
    const response: ApiResponse<never> = {
      success: false,
      error: 'Failed to create booking'
    };
    return res.status(500).json(response);
  }
});

// DELETE /api/bookings/:id - Cancel booking
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { employeeName } = req.body; // Require employee name for ownership validation

    if (!id || !id.trim()) {
      const response: ApiResponse<never> = {
        success: false,
        error: 'Booking ID is required'
      };
      return res.status(400).json(response);
    }

    if (!employeeName || !employeeName.trim()) {
      const response: ApiResponse<never> = {
        success: false,
        error: 'Employee name is required to cancel booking'
      };
      return res.status(400).json(response);
    }

    // Get the booking to check ownership
    const booking = await db.getBookingById(id);
    if (!booking) {
      const response: ApiResponse<never> = {
        success: false,
        error: 'Booking not found'
      };
      return res.status(404).json(response);
    }

    // Business rule: Can only cancel own bookings
    if (booking.employeeName.toLowerCase() !== employeeName.trim().toLowerCase()) {
      const response: ApiResponse<never> = {
        success: false,
        error: 'You can only cancel your own bookings'
      };
      return res.status(403).json(response);
    }

    // Business rule: Cannot cancel bookings for today or past dates
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const bookingDate = new Date(booking.date);
    
    if (bookingDate <= today) {
      const response: ApiResponse<never> = {
        success: false,
        error: 'Cannot cancel bookings for today or past dates'
      };
      return res.status(400).json(response);
    }

    const deleted = await db.deleteBooking(id);
    
    if (!deleted) {
      const response: ApiResponse<never> = {
        success: false,
        error: 'Failed to cancel booking'
      };
      return res.status(500).json(response);
    }

    const response: ApiResponse<{ deleted: boolean }> = {
      success: true,
      data: { deleted: true }
    };
    return res.json(response);
  } catch (error) {
    console.error('Error deleting booking:', error);
    const response: ApiResponse<never> = {
      success: false,
      error: 'Failed to cancel booking'
    };
    return res.status(500).json(response);
  }
});

export default router;