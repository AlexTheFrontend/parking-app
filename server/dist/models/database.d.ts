export interface Booking {
    id: string;
    employeeName: string;
    date: string;
    createdAt: string;
}
export interface CreateBookingRequest {
    employeeName: string;
    date: string;
}
declare class Database {
    private db;
    constructor();
    private initializeDatabase;
    createBooking(bookingData: CreateBookingRequest): Promise<Booking>;
    getAllBookings(): Promise<Booking[]>;
    getBookingByDate(date: string): Promise<Booking | null>;
    deleteBooking(id: string): Promise<boolean>;
    close(): void;
}
export default Database;
//# sourceMappingURL=database.d.ts.map