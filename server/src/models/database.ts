import sqlite3 from 'sqlite3';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

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

class Database {
  private db: sqlite3.Database;

  constructor() {
    const dbPath = path.join(process.cwd(), 'parking_bookings.db');
    this.db = new sqlite3.Database(dbPath);
    this.initializeDatabase();
  }

  private initializeDatabase(): void {
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS bookings (
        id TEXT PRIMARY KEY,
        employeeName TEXT NOT NULL,
        date TEXT NOT NULL UNIQUE,
        createdAt TEXT NOT NULL
      )
    `;

    this.db.run(createTableQuery, (err) => {
      if (err) {
        console.error('Error creating bookings table:', err.message);
      } else {
        console.log('Database initialized successfully');
      }
    });
  }

  async createBooking(bookingData: CreateBookingRequest): Promise<Booking> {
    return new Promise((resolve, reject) => {
      const id = uuidv4();
      const createdAt = new Date().toISOString();
      const { employeeName, date } = bookingData;

      const query = `
        INSERT INTO bookings (id, employeeName, date, createdAt)
        VALUES (?, ?, ?, ?)
      `;

      this.db.run(query, [id, employeeName, date, createdAt], function(err) {
        if (err) {
          reject(err);
        } else {
          resolve({
            id,
            employeeName,
            date,
            createdAt
          });
        }
      });
    });
  }

  async getAllBookings(): Promise<Booking[]> {
    return new Promise((resolve, reject) => {
      const query = 'SELECT * FROM bookings ORDER BY date DESC';
      
      this.db.all(query, (err, rows: Booking[]) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }

  async getBookingByDate(date: string): Promise<Booking | null> {
    return new Promise((resolve, reject) => {
      const query = 'SELECT * FROM bookings WHERE date = ?';
      
      this.db.get(query, [date], (err, row: Booking | undefined) => {
        if (err) {
          reject(err);
        } else {
          resolve(row || null);
        }
      });
    });
  }

  async getBookingById(id: string): Promise<Booking | null> {
    return new Promise((resolve, reject) => {
      const query = 'SELECT * FROM bookings WHERE id = ?';
      
      this.db.get(query, [id], (err, row: Booking | undefined) => {
        if (err) {
          reject(err);
        } else {
          resolve(row || null);
        }
      });
    });
  }

  async getBookingsByEmployee(employeeName: string): Promise<Booking[]> {
    return new Promise((resolve, reject) => {
      const query = 'SELECT * FROM bookings WHERE employeeName = ? ORDER BY date DESC';
      
      this.db.all(query, [employeeName], (err, rows: Booking[]) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }

  async deleteBooking(id: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const query = 'DELETE FROM bookings WHERE id = ?';
      
      this.db.run(query, [id], function(err) {
        if (err) {
          reject(err);
        } else {
          resolve(this.changes > 0);
        }
      });
    });
  }

  close(): void {
    this.db.close((err) => {
      if (err) {
        console.error('Error closing database:', err.message);
      } else {
        console.log('Database connection closed');
      }
    });
  }
}

export default Database;