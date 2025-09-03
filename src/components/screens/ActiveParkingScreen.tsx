import React, { useState, useEffect } from 'react';
import { ParkingSession } from '../../types';
import { Button } from '../atoms';

interface ActiveParkingScreenProps {
  session: ParkingSession;
  onStopParking: () => void;
  onSupport: () => void;
  onBackPress: () => void;
}

export const ActiveParkingScreen: React.FC<ActiveParkingScreenProps> = ({
  session,
  onStopParking,
  onSupport,
  onBackPress,
}) => {
  const [elapsedTime, setElapsedTime] = useState(0);
  const [currentCost, setCurrentCost] = useState(0);

  useEffect(() => {
    const startTime = new Date(session.startTime).getTime();
    
    const timer = setInterval(() => {
      const now = Date.now();
      const elapsed = Math.floor((now - startTime) / 1000 / 60); // minutes
      setElapsedTime(elapsed);
      
      // Calculate cost based on hourly rate
      const hours = elapsed / 60;
      const cost = Math.min(
        hours * session.location.pricing.hourlyRate,
        session.location.pricing.maxDailyRate
      );
      setCurrentCost(cost);
    }, 1000);

    return () => clearInterval(timer);
  }, [session]);

  const formatTime = (minutes: number) => {
    if (minutes < 60) {
      return `${minutes}min`;
    }
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}min` : `${hours}h`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white px-4 py-3 flex items-center shadow-sm">
        <button onClick={onBackPress} className="mr-3 px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors font-medium">
          ← Back
        </button>
      </div>

      <div className="px-4 pb-6">
        {/* Title */}
        <div className="text-center py-6">
          <h1 className="text-2xl font-bold text-gray-900">Park anywhere in</h1>
          <h2 className="text-2xl font-bold text-gray-900">{session.location.name}</h2>
        </div>

        {/* Time and Cost Cards */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-gray-200 rounded-lg p-6 text-center">
            <div className="text-sm text-gray-600 mb-3">Time elapsed</div>
            <div className="text-2xl font-bold text-gray-900">{formatTime(elapsedTime)}</div>
          </div>

          <div className="bg-gray-200 rounded-lg p-6 text-center">
            <div className="text-sm text-gray-600 mb-3">Running total</div>
            <div className="text-2xl font-bold text-gray-900">${currentCost.toFixed(2)}</div>
          </div>
        </div>

        {/* Parking Details */}
        <div className="bg-white rounded-lg shadow-sm mb-8">
          <div className="px-4 py-3 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Parking details</h3>
          </div>

          <div className="space-y-4 p-4">
            {/* Closing Time */}
            <div className="flex items-center justify-between">
              <span className="text-gray-900">Closes {session.location.closingTime}</span>
              <span className="text-gray-400">→</span>
            </div>

            {/* Car Park */}
            <div>
              <div className="text-gray-500 text-sm">Car park</div>
              <div className="text-gray-900">Public casual + Public subs</div>
            </div>

            {/* Location */}
            <div>
              <span className="text-gray-900">{session.location.address}</span>
              <button className="text-blue-600 ml-2 underline font-medium">Directions</button>
            </div>

            {/* Additional Info */}
            <div className="pt-2 text-gray-500 text-sm">
              Park anywhere in {session.location.name}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button
            onClick={onStopParking}
            variant="primary"
            className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-4 text-lg rounded-xl"
          >
            Stop parking
          </Button>

          <Button
            onClick={onSupport}
            variant="secondary"
            className="w-full border-2 border-gray-300 text-gray-700 font-semibold py-4 text-lg rounded-xl bg-white"
          >
            Support
          </Button>
        </div>
      </div>
    </div>
  );
};