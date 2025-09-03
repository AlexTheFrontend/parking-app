"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sqlite3_1 = __importDefault(require("sqlite3"));
const path_1 = __importDefault(require("path"));
const uuid_1 = require("uuid");
class Database {
    constructor() {
        const dbPath = path_1.default.join(process.cwd(), 'parking_bookings.db');
        this.db = new sqlite3_1.default.Database(dbPath);
        this.initializeDatabase();
    }
    initializeDatabase() {
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
            }
            else {
                console.log('Database initialized successfully');
            }
        });
    }
    async createBooking(bookingData) {
        return new Promise((resolve, reject) => {
            const id = (0, uuid_1.v4)();
            const createdAt = new Date().toISOString();
            const { employeeName, date } = bookingData;
            const query = `
        INSERT INTO bookings (id, employeeName, date, createdAt)
        VALUES (?, ?, ?, ?)
      `;
            this.db.run(query, [id, employeeName, date, createdAt], function (err) {
                if (err) {
                    reject(err);
                }
                else {
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
    async getAllBookings() {
        return new Promise((resolve, reject) => {
            const query = 'SELECT * FROM bookings ORDER BY date DESC';
            this.db.all(query, (err, rows) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(rows);
                }
            });
        });
    }
    async getBookingByDate(date) {
        return new Promise((resolve, reject) => {
            const query = 'SELECT * FROM bookings WHERE date = ?';
            this.db.get(query, [date], (err, row) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(row || null);
                }
            });
        });
    }
    async deleteBooking(id) {
        return new Promise((resolve, reject) => {
            const query = 'DELETE FROM bookings WHERE id = ?';
            this.db.run(query, [id], function (err) {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(this.changes > 0);
                }
            });
        });
    }
    close() {
        this.db.close((err) => {
            if (err) {
                console.error('Error closing database:', err.message);
            }
            else {
                console.log('Database connection closed');
            }
        });
    }
}
exports.default = Database;
//# sourceMappingURL=database.js.map