import React, { useState } from 'react';
import { ParkingLocation, DateTimeSelection, TimeSlot, TokenBalance } from '../../types';
import { Button } from '../atoms';
import { TokenManager } from '../../utils/tokenManager';

interface DateTimeSelectionScreenProps {
  location: ParkingLocation;
  tokenBalance: TokenBalance;
  onSelectDateTime: (dateTime: DateTimeSelection) => void;
  onBackPress: () => void;
}

export const DateTimeSelectionScreen: React.FC<DateTimeSelectionScreenProps> = ({
  location,
  tokenBalance,
  onSelectDateTime,
  onBackPress,
}) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string>('');

  // Generate available dates (today + next 14 days)
  const generateAvailableDates = (): Date[] => {
    const dates: Date[] = [];
    const today = new Date();
    
    for (let i = 0; i <= 14; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push(date);
    }
    
    return dates;
  };

  // Generate time slots (6 AM to 10 PM, every hour)
  const generateTimeSlots = (): TimeSlot[] => {
    const slots: TimeSlot[] = [];
    
    for (let hour = 6; hour <= 22; hour++) {
      const time = `${hour.toString().padStart(2, '0')}:00`;
      const label = hour < 12 
        ? `${hour}:00 AM`
        : hour === 12 
        ? '12:00 PM'
        : `${hour - 12}:00 PM`;
      
      slots.push({
        time,
        label,
        available: true // In a real app, this would check actual availability
      });
    }
    
    return slots;
  };

  const availableDates = generateAvailableDates();
  const timeSlots = generateTimeSlots();

  const formatDate = (date: Date): string => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    
    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow';
    } else {
      return date.toLocaleDateString('en-US', { 
        weekday: 'short', 
        month: 'short', 
        day: 'numeric' 
      });
    }
  };

  const handleContinue = () => {
    if (selectedDate && selectedTime) {
      onSelectDateTime({
        date: selectedDate,
        startTime: selectedTime
      });
    }
  };

  const isToday = (date: Date): boolean => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isPastTime = (time: string, date: Date): boolean => {
    if (!isToday(date)) return false;
    
    const now = new Date();
    const [hours] = time.split(':').map(Number);
    
    return hours <= now.getHours();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 px-6 py-4 flex items-center">
        <button 
          onClick={onBackPress} 
          className="mr-4 px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors font-medium"
        >
          ← Back
        </button>
        <h1 className="text-lg font-semibold text-gray-900">Select Date & Time</h1>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Token Balance Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-gray-900">{tokenBalance.currentTokens}</div>
              <div className="text-sm text-gray-600">Available Tokens</div>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-500">Refreshes in</div>
              <div className="text-sm font-medium text-blue-600">{TokenManager.getTimeUntilRefresh()}</div>
            </div>
          </div>
        </div>

        {/* Location Info */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-8">
          <h3 className="text-xl font-bold text-gray-900 mb-2">{location.name}</h3>
          <p className="text-gray-600 mb-4">{location.address}</p>
          <div className="text-sm text-gray-600">
            <strong>Availability:</strong> {location.availableSpaces} spaces available
          </div>
        </div>

        {/* Date Selection */}
        <div className="mb-8">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Select date</h3>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {availableDates.map((date, index) => {
              const isSelected = selectedDate?.toDateString() === date.toDateString();
              
              return (
                <button
                  key={index}
                  onClick={() => setSelectedDate(date)}
                  className={`p-4 rounded-xl border-2 text-center transition-all transform ${
                    isSelected
                      ? 'border-blue-500 bg-blue-50 shadow-lg scale-105'
                      : 'border-gray-200 bg-white hover:border-blue-300 hover:shadow-lg hover:scale-105'
                  }`}
                >
                  <div className="text-sm font-bold text-gray-900">{formatDate(date)}</div>
                  <div className="text-xs text-gray-500">
                    {date.toLocaleDateString('en-US', { month: 'numeric', day: 'numeric' })}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Time Selection */}
        {selectedDate && (
          <div className="mb-8">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Select start time</h3>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {timeSlots.map((slot) => {
                const isSelected = selectedTime === slot.time;
                const isPast = isPastTime(slot.time, selectedDate);
                const isDisabled = !slot.available || isPast;
                
                return (
                  <button
                    key={slot.time}
                    onClick={() => !isDisabled && setSelectedTime(slot.time)}
                    disabled={isDisabled}
                    className={`p-4 rounded-xl border-2 text-center transition-all transform ${
                      isSelected
                        ? 'border-blue-500 bg-blue-50 shadow-lg scale-105'
                        : isDisabled
                        ? 'border-gray-200 bg-gray-50 opacity-50 cursor-not-allowed'
                        : 'border-gray-200 bg-white hover:border-blue-300 hover:shadow-lg hover:scale-105'
                    }`}
                  >
                    <div className="text-sm font-bold text-gray-900">{slot.label}</div>
                    {isPast && (
                      <div className="text-xs text-red-500">Past time</div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Selection Summary */}
        {selectedDate && selectedTime && (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-8">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Booking Summary</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Date:</span>
                <span className="font-bold text-gray-900">{formatDate(selectedDate)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Start time:</span>
                <span className="font-bold text-gray-900">
                  {timeSlots.find(slot => slot.time === selectedTime)?.label}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Location:</span>
                <span className="font-bold text-gray-900">{location.name}</span>
              </div>
            </div>
          </div>
        )}

        {/* Continue Button */}
        <Button
          onClick={handleContinue}
          disabled={!selectedDate || !selectedTime}
          variant="primary"
          className={`w-full font-bold py-4 px-8 text-lg rounded-2xl shadow-lg transition-all duration-200 transform ${
            !selectedDate || !selectedTime
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 hover:shadow-xl hover:scale-105 text-white'
          }`}
        >
          Continue to Duration →
        </Button>
      </div>
    </div>
  );
};