import React from 'react';
import { ParkingLocation, Vehicle, PaymentMethod, ParkingDuration, TokenBalance, DateTimeSelection } from '../../types';
import { Button } from '../atoms';

interface ConfirmationScreenProps {
  location: ParkingLocation;
  vehicle: Vehicle;
  paymentMethod: PaymentMethod;
  duration: ParkingDuration;
  isPriority: boolean;
  tokenBalance: TokenBalance;
  selectedDateTime?: DateTimeSelection;
  onConfirm: () => void;
  onBackPress: () => void;
}

export const ConfirmationScreen: React.FC<ConfirmationScreenProps> = ({
  location,
  vehicle,
  paymentMethod,
  duration,
  isPriority,
  tokenBalance,
  selectedDateTime,
  onConfirm,
  onBackPress,
}) => {
  const totalTokens = duration.tokens + (isPriority ? 5 : 0);
  
  const formatDateTime = () => {
    if (!selectedDateTime) return null;
    
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    
    let dateStr = '';
    if (selectedDateTime.date.toDateString() === today.toDateString()) {
      dateStr = 'Today';
    } else if (selectedDateTime.date.toDateString() === tomorrow.toDateString()) {
      dateStr = 'Tomorrow';
    } else {
      dateStr = selectedDateTime.date.toLocaleDateString('en-US', { 
        weekday: 'long', 
        month: 'long', 
        day: 'numeric' 
      });
    }
    
    const [hours] = selectedDateTime.startTime.split(':').map(Number);
    const timeStr = hours < 12 
      ? `${hours}:00 AM`
      : hours === 12 
      ? '12:00 PM'
      : `${hours - 12}:00 PM`;
    
    return `${dateStr} at ${timeStr}`;
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white px-4 py-3 flex items-center shadow-sm">
        <button onClick={onBackPress} className="mr-3 px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors font-medium">
          ← Back
        </button>
        <h1 className="text-xl font-semibold text-gray-900">Confirm details</h1>
      </div>

      <div className="px-4 pb-6">
        {/* Holding Space Banner */}
        <div className="bg-yellow-100 rounded-lg p-4 my-6 flex items-center">
          <div className="flex-1">
            <span className="text-yellow-800 font-semibold">🔒 Holding space</span>
          </div>
          <span className="text-yellow-700 font-semibold">5 mins</span>
        </div>

        {/* Details List */}
        <div className="space-y-6">
          {/* Closing Time */}
          <div className="flex items-center justify-between">
            <span className="text-gray-900">Closes {location.closingTime}</span>
            <span className="text-gray-400">→</span>
          </div>

          {/* Location */}
          <div className="space-y-2">
            <div className="text-gray-500 text-sm">Park anywhere in</div>
            <div className="text-gray-900 font-medium">{location.name}</div>
          </div>

          {/* Vehicle */}
          <div className="flex items-center justify-between">
            <div>
              <div className="text-gray-500 text-sm">Vehicle</div>
              <div className="text-gray-900 font-medium uppercase">{vehicle.type}</div>
            </div>
            <span className="text-gray-400">→</span>
          </div>

          {/* Scheduled Time */}
          {selectedDateTime && (
            <div className="flex items-center justify-between">
              <div>
                <div className="text-gray-500 text-sm">Scheduled for</div>
                <div className="text-gray-900 font-medium">{formatDateTime()}</div>
              </div>
              <span className="text-gray-400">→</span>
            </div>
          )}

          {/* Duration */}
          <div className="flex items-center justify-between">
            <div>
              <div className="text-gray-500 text-sm">Duration</div>
              <div className="text-gray-900 font-medium">{duration.label}</div>
              <div className="text-gray-600 text-sm">
                {duration.tokens} token{duration.tokens !== 1 ? 's' : ''}
                {isPriority && <span> + 5 tokens (Priority)</span>}
              </div>
            </div>
            <span className="text-gray-400">→</span>
          </div>

          {/* Token Balance */}
          <div className="flex items-center justify-between">
            <div>
              <div className="text-gray-500 text-sm">Token cost</div>
              <div className="text-gray-900 font-medium">{totalTokens} tokens</div>
              <div className="text-gray-600 text-sm">
                {tokenBalance.currentTokens - totalTokens} remaining after booking
              </div>
            </div>
            <span className="text-gray-400">→</span>
          </div>

          {/* Payment Method */}
          <div className="flex items-center justify-between">
            <div>
              <div className="text-gray-500 text-sm">Payment method</div>
              <div className="text-gray-900 font-medium">Card ending {paymentMethod.last4}</div>
            </div>
            <span className="text-gray-400">→</span>
          </div>

          {/* Car Park */}
          <div>
            <div className="text-gray-500 text-sm">Car park</div>
            <div className="text-gray-900">Public casual + Public subs</div>
          </div>

          {/* Location Address */}
          <div>
            <span className="text-gray-900">{location.address}</span>
            <button className="text-blue-600 ml-2 underline font-medium">Directions</button>
          </div>
        </div>

        {/* Confirm Button */}
        <div className="mt-8">
          <Button
            onClick={onConfirm}
            variant="primary"
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-4 text-lg rounded-xl"
          >
            Confirm
          </Button>
        </div>
      </div>
    </div>
  );
};