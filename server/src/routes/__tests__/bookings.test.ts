import request from 'supertest';
import express from 'express';
import bookingsRouter from '../bookings';

const app = express();
app.use(express.json());
app.use('/api/bookings', bookingsRouter);

describe('Bookings API', () => {
  describe('POST /api/bookings', () => {
    it('should create a new booking with valid data', async () => {
      const bookingData = {
        employeeName: 'John Doe',
        date: '2025-01-15'
      };

      const response = await request(app)
        .post('/api/bookings')
        .send(bookingData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.employeeName).toBe('John Doe');
      expect(response.body.data.date).toBe('2025-01-15');
    });

    it('should reject booking with invalid employee name', async () => {
      const bookingData = {
        employeeName: 'A', // Too short
        date: '2025-01-15'
      };

      const response = await request(app)
        .post('/api/bookings')
        .send(bookingData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('Employee name must be 2-50 characters');
    });

    it('should reject booking on weekend', async () => {
      const bookingData = {
        employeeName: 'John Doe',
        date: '2025-01-18' // Saturday
      };

      const response = await request(app)
        .post('/api/bookings')
        .send(bookingData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('Business days only');
    });

    it('should reject past date booking', async () => {
      const pastDate = new Date();
      pastDate.setDate(pastDate.getDate() - 1);
      const pastDateString = pastDate.toISOString().split('T')[0];

      const bookingData = {
        employeeName: 'John Doe',
        date: pastDateString
      };

      const response = await request(app)
        .post('/api/bookings')
        .send(bookingData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('must be today or in the future');
    });
  });

  describe('GET /api/bookings', () => {
    it('should return all bookings', async () => {
      const response = await request(app)
        .get('/api/bookings')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
    });
  });

  describe('GET /api/bookings/:date', () => {
    it('should return booking for valid date', async () => {
      const response = await request(app)
        .get('/api/bookings/2025-01-15')
        .expect(200);

      expect(response.body.success).toBe(true);
    });

    it('should reject invalid date format', async () => {
      const response = await request(app)
        .get('/api/bookings/invalid-date')
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('Invalid date format');
    });
  });

  describe('DELETE /api/bookings/:id', () => {
    it('should require employee name for cancellation', async () => {
      const response = await request(app)
        .delete('/api/bookings/some-id')
        .send({})
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('Employee name is required');
    });
  });
});
