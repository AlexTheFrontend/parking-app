import React from 'react';
import { ParkingSession } from '../../types';
import { Button } from '../atoms';

interface SessionSummaryScreenProps {
  session: ParkingSession;
  onBackPress: () => void;
  onNewSession: () => void;
}

export const SessionSummaryScreen: React.FC<SessionSummaryScreenProps> = ({
  session,
  onBackPress,
  onNewSession,
}) => {
  const calculateDuration = () => {
    if (!session.endTime) return 0;
    const start = new Date(session.startTime).getTime();
    const end = new Date(session.endTime).getTime();
    return Math.floor((end - start) / 1000 / 60); // minutes
  };

  const formatTime = (minutes: number) => {
    if (minutes < 60) {
      return `${minutes}min`;
    }
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}min` : `${hours}h`;
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      }),
      time: date.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
      })
    };
  };

  const duration = calculateDuration();
  const startDateTime = formatDateTime(session.startTime);
  const endDateTime = session.endTime ? formatDateTime(session.endTime) : null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white px-4 py-3 flex items-center shadow-sm">
        <button onClick={onBackPress} className="mr-3 px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors font-medium">
          ← Back
        </button>
        <h1 className="text-xl font-semibold text-gray-900">Parking Session</h1>
      </div>

      <div className="px-4 pb-6">
        {/* Success Message */}
        <div className="text-center py-8">
          <div className="text-5xl mb-4">✓</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Session Complete</h2>
          <p className="text-gray-600">Your parking session has ended successfully</p>
        </div>

        {/* Session Summary Cards */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-white rounded-lg p-6 text-center shadow-sm">
            <div className="text-sm text-gray-600 mb-3">Duration</div>
            <div className="text-2xl font-bold text-gray-900">{formatTime(duration)}</div>
          </div>

          <div className="bg-white rounded-lg p-6 text-center shadow-sm">
            <div className="text-sm text-gray-600 mb-3">Tokens Used</div>
            <div className="text-2xl font-bold text-gray-900">{session.tokensUsed}</div>
          </div>
        </div>

        {/* Session Details */}
        <div className="bg-white rounded-lg shadow-sm mb-8">
          <div className="px-4 py-3 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Session Details</h3>
          </div>

          <div className="space-y-4 p-4">
            {/* Location */}
            <div>
              <div className="text-gray-900 font-medium">{session.location.name}</div>
              <div className="text-sm text-gray-600">{session.location.address}</div>
            </div>

            {/* Start Time */}
            <div>
              <div className="text-gray-900 font-medium">Started</div>
              <div className="text-sm text-gray-600">
                {startDateTime.date} at {startDateTime.time}
              </div>
            </div>

            {/* End Time */}
            {endDateTime && (
              <div>
                <div className="text-gray-900 font-medium">Ended</div>
                <div className="text-sm text-gray-600">
                  {endDateTime.date} at {endDateTime.time}
                </div>
              </div>
            )}

            {/* Vehicle */}
            <div>
              <div className="text-gray-900 font-medium uppercase">{session.vehicle.type}</div>
              {session.vehicle.licensePlate && (
                <div className="text-sm text-gray-600">{session.vehicle.licensePlate}</div>
              )}
            </div>

            {/* Rate */}
            <div>
              <div className="text-gray-900 font-medium">
                ${session.location.pricing.hourlyRate.toFixed(2)}/hour
              </div>
              <div className="text-sm text-gray-600">
                Max ${session.location.pricing.maxDailyRate.toFixed(2)} per day
              </div>
            </div>
          </div>
        </div>

        {/* Token Breakdown */}
        <div className="bg-white rounded-lg shadow-sm mb-8">
          <div className="px-4 py-3 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Token Usage</h3>
          </div>

          <div className="space-y-3 p-4">
            {session.duration && (
              <div className="flex justify-between items-center">
                <span className="text-gray-900">Duration ({session.duration.label})</span>
                <span className="text-gray-900 font-medium">{session.duration.tokens} tokens</span>
              </div>
            )}

            {session.isPriority && (
              <div className="flex justify-between items-center">
                <span className="text-gray-900">Priority parking</span>
                <span className="text-gray-900 font-medium">5 tokens</span>
              </div>
            )}

            <div className="border-t border-gray-200 pt-3 flex justify-between items-center">
              <span className="text-lg font-semibold text-gray-900">Total tokens used</span>
              <span className="text-lg font-bold text-gray-900">{session.tokensUsed}</span>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="space-y-3">
          <Button
            onClick={onNewSession}
            variant="primary"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 text-lg rounded-xl"
          >
            Start New Session
          </Button>
        </div>
      </div>
    </div>
  );
};