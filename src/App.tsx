import React, { useState } from 'react';
import { BookingForm, BookingList } from './components';
import { BookingFormData } from './types';
import { useBookings } from './hooks';
import './App.css';

function App() {
  const { 
    bookings, 
    isLoading: bookingsLoading, 
    error: bookingsError,
    createBooking, 
    cancelBooking,
    refreshBookings
  } = useBookings();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentUser] = useState('John Doe'); // Mock current user
  const [notification, setNotification] = useState<{type: 'success' | 'error'; message: string} | null>(null);

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 5000);
  };

  const handleBookingSubmit = async (formData: BookingFormData) => {
    if (!formData.selectedDate) return;
    
    setIsSubmitting(true);
    
    const result = await createBooking({
      employeeName: formData.employeeName,
      date: formData.selectedDate.toISOString().split('T')[0],
    });
    
    setIsSubmitting(false);
    
    if (result.success) {
      showNotification('success', 'Booking created successfully!');
    } else {
      showNotification('error', result.error || 'Failed to create booking');
    }
  };

  const handleCancelBooking = async (bookingId: string) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      const result = await cancelBooking(bookingId);
      
      if (result.success) {
        showNotification('success', 'Booking cancelled successfully!');
      } else {
        showNotification('error', result.error || 'Failed to cancel booking');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Notification */}
        {notification && (
          <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg max-w-sm animate-[slideInRight_0.3s_ease-out] ${
            notification.type === 'success' 
              ? 'bg-green-100 text-green-800 border-l-4 border-green-500' 
              : 'bg-red-100 text-red-800 border-l-4 border-red-500'
          }`}>
            <div className="flex items-center">
              <div className="flex-shrink-0">
                {notification.type === 'success' ? '✓' : '✕'}
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium">{notification.message}</p>
              </div>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            🅿️ Parking Slot Booking
          </h1>
          <p className="text-lg text-gray-600">
            Manage your company's shared parking space
          </p>
        </div>

        {/* Global Error State */}
        {bookingsError && (
          <div className="mb-8 bg-red-100 border-l-4 border-red-500 text-red-800 p-4 rounded-lg">
            <div className="flex">
              <div className="flex-shrink-0">
                <span className="text-lg">⚠️</span>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium">Connection Error</h3>
                <p className="text-sm">{bookingsError}</p>
                <button
                  onClick={refreshBookings}
                  className="mt-2 text-sm underline hover:no-underline"
                >
                  Try Again
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Booking Form */}
          <div>
            <BookingForm
              onSubmit={handleBookingSubmit}
              isLoading={isSubmitting}
            />
            
            {/* Status Info */}
            <div className="mt-6 bg-white rounded-lg shadow-md p-4">
              <h3 className="text-sm font-semibold text-gray-700 mb-2">
                System Status
              </h3>
              <div className="flex items-center space-x-4 text-sm">
                <div className="flex items-center">
                  <div className={`w-3 h-3 rounded-full mr-2 ${bookingsError ? 'bg-red-500' : 'bg-green-500'}`}></div>
                  <span className="text-gray-600">
                    {bookingsError ? 'Connection Error' : 'System Online'}
                  </span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                  <span className="text-gray-600">Current User: {currentUser}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Booking List */}
          <div>
            <BookingList
              bookings={bookings}
              onCancelBooking={handleCancelBooking}
              currentUserName={currentUser}
              isLoading={bookingsLoading}
            />
          </div>
        </div>
        
        {/* Footer Info */}
        <div className="mt-12 text-center text-sm text-gray-600">
          <p className="mb-2">✨ Built with Atomic Design & Full-Stack TypeScript</p>
          <p>
            <strong>Frontend:</strong> React + TypeScript + Tailwind | 
            <strong> Backend:</strong> Node.js + Express + SQLite | 
            <strong> Architecture:</strong> Atomic Design
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;
