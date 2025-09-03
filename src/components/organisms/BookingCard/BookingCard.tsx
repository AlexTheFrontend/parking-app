import React from 'react';
import { Button } from '../../atoms';
import { Booking } from '../../../types';

export interface BookingCardProps {
  booking: Booking;
  onCancel?: (bookingId: string) => void;
  currentUserName?: string;
  className?: string;
}

export const BookingCard: React.FC<BookingCardProps> = ({
  booking,
  onCancel,
  currentUserName,
  className = '',
}) => {
  const canCancel = currentUserName === booking.employeeName;
  const bookingDate = new Date(booking.date);
  const isPastDate = bookingDate < new Date();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
      <div className={`bg-white rounded-lg shadow-md border-l-4 ${isPastDate ? 'border-gray-400 opacity-70' : 'border-blue-500'} p-4 transform hover:scale-105 transition-all duration-200 animate-[fadeInUp_0.5s_ease-out] ${className}`}>
        <div className="flex justify-between items-start mb-2">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900">
              {booking.employeeName}
            </h3>
            <p className="text-sm text-gray-600">
              {formatDate(booking.date)}
            </p>
          </div>
          <div className="flex flex-col items-end">
            {isPastDate && (
              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full mb-2">
                Past
              </span>
            )}
            {!isPastDate && (
              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full mb-2">
                Active
              </span>
            )}
          </div>
        </div>
        
        <div className="text-xs text-gray-500 mb-3">
          Booked on {new Date(booking.createdAt).toLocaleDateString()}
        </div>
        
        {canCancel && !isPastDate && onCancel && (
          <div className="flex justify-end">
            <Button
              onClick={() => onCancel(booking.id)}
              variant="secondary"
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              Cancel Booking
            </Button>
          </div>
        )}
      </div>
  );
};