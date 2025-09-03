"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const database_1 = __importDefault(require("../models/database"));
const router = (0, express_1.Router)();
const db = new database_1.default();
// Helper function to validate date format (YYYY-MM-DD)
function isValidDate(dateString) {
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    if (!regex.test(dateString))
        return false;
    const date = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date >= today && !isNaN(date.getTime());
}
// GET /api/bookings - Get all bookings
router.get('/', async (req, res) => {
    try {
        const bookings = await db.getAllBookings();
        const response = {
            success: true,
            data: bookings
        };
        res.json(response);
    }
    catch (error) {
        console.error('Error fetching bookings:', error);
        const response = {
            success: false,
            error: 'Failed to fetch bookings'
        };
        res.status(500).json(response);
    }
});
// GET /api/bookings/:date - Get booking for specific date
router.get('/:date', async (req, res) => {
    try {
        const { date } = req.params;
        if (!isValidDate(date)) {
            const response = {
                success: false,
                error: 'Invalid date format. Use YYYY-MM-DD'
            };
            return res.status(400).json(response);
        }
        const booking = await db.getBookingByDate(date);
        const response = {
            success: true,
            data: booking
        };
        res.json(response);
    }
    catch (error) {
        console.error('Error fetching booking:', error);
        const response = {
            success: false,
            error: 'Failed to fetch booking'
        };
        res.status(500).json(response);
    }
});
// POST /api/bookings - Create new booking
router.post('/', async (req, res) => {
    try {
        const { employeeName, date } = req.body;
        // Validation
        if (!employeeName || !employeeName.trim()) {
            const response = {
                success: false,
                error: 'Employee name is required'
            };
            return res.status(400).json(response);
        }
        if (!date || !isValidDate(date)) {
            const response = {
                success: false,
                error: 'Valid date is required (YYYY-MM-DD, not in the past)'
            };
            return res.status(400).json(response);
        }
        // Check if date is already booked
        const existingBooking = await db.getBookingByDate(date);
        if (existingBooking) {
            const response = {
                success: false,
                error: 'This date is already booked'
            };
            return res.status(409).json(response);
        }
        // Create booking
        const newBooking = await db.createBooking({
            employeeName: employeeName.trim(),
            date
        });
        const response = {
            success: true,
            data: newBooking
        };
        res.status(201).json(response);
    }
    catch (error) {
        console.error('Error creating booking:', error);
        const response = {
            success: false,
            error: 'Failed to create booking'
        };
        res.status(500).json(response);
    }
});
// DELETE /api/bookings/:id - Cancel booking
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        if (!id || !id.trim()) {
            const response = {
                success: false,
                error: 'Booking ID is required'
            };
            return res.status(400).json(response);
        }
        const deleted = await db.deleteBooking(id);
        if (!deleted) {
            const response = {
                success: false,
                error: 'Booking not found'
            };
            return res.status(404).json(response);
        }
        const response = {
            success: true,
            data: { deleted: true }
        };
        res.json(response);
    }
    catch (error) {
        console.error('Error deleting booking:', error);
        const response = {
            success: false,
            error: 'Failed to delete booking'
        };
        res.status(500).json(response);
    }
});
exports.default = router;
//# sourceMappingURL=bookings.js.map