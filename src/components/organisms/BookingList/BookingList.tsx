import React from 'react';
import { BookingCard } from '../BookingCard';
import { Booking } from '../../../types';

export interface BookingListProps {
  bookings: Booking[];
  onCancelBooking?: (bookingId: string) => Promise<void> | void;
  currentUserName?: string;
  isLoading?: boolean;
  className?: string;
}

export const BookingList: React.FC<BookingListProps> = ({
  bookings,
  onCancelBooking,
  currentUserName,
  isLoading = false,
  className = '',
}) => {
  if (isLoading) {
    return (
      <div className={`bg-white rounded-lg shadow-lg p-6 ${className}`}>
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          Current Bookings
        </h2>
        <div className="text-center py-8">
          <div className="animate-spin inline-block w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
          <p className="mt-2 text-gray-600">Loading bookings...</p>
        </div>
      </div>
    );
  }

  if (bookings.length === 0) {
    return (
        <div className={`bg-white rounded-lg shadow-lg p-6 animate-[slideInRight_0.6s_ease-out] ${className}`}>
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Current Bookings
          </h2>
          <div className="text-center py-8">
            <div className="text-6xl mb-4">🅿️</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No bookings yet
            </h3>
            <p className="text-gray-600">
              The parking slot is available for booking!
            </p>
          </div>
        </div>
    );
  }

  // Sort bookings by date (newest first)
  const sortedBookings = [...bookings].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const activeBookings = sortedBookings.filter(booking => 
    new Date(booking.date) >= new Date()
  );
  
  const pastBookings = sortedBookings.filter(booking => 
    new Date(booking.date) < new Date()
  );

  return (
      <div className={`bg-white rounded-lg shadow-lg p-6 animate-[slideInRight_0.6s_ease-out] ${className}`}>
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          Parking Bookings
        </h2>
        
        {activeBookings.length > 0 && (
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
              Active Bookings ({activeBookings.length})
            </h3>
            <div className="space-y-3">
              {activeBookings.map((booking) => (
                <BookingCard
                  key={booking.id}
                  booking={booking}
                  onCancel={onCancelBooking}
                  currentUserName={currentUserName}
                />
              ))}
            </div>
          </div>
        )}
        
        {pastBookings.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-gray-600 mb-4 flex items-center">
              <span className="w-3 h-3 bg-gray-400 rounded-full mr-2"></span>
              Past Bookings ({pastBookings.length})
            </h3>
            <div className="space-y-3">
              {pastBookings.slice(0, 5).map((booking) => (
                <BookingCard
                  key={booking.id}
                  booking={booking}
                  currentUserName={currentUserName}
                />
              ))}
            </div>
            {pastBookings.length > 5 && (
              <p className="text-sm text-gray-500 text-center mt-4">
                And {pastBookings.length - 5} more past bookings...
              </p>
            )}
          </div>
        )}
      </div>
  );
};