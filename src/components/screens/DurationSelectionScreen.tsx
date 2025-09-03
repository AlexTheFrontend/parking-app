import React, { useState } from 'react';
import { ParkingLocation, ParkingDuration, TokenBalance, PARKING_DURATIONS, PRIORITY_PARKING_TOKENS } from '../../types';
import { Button } from '../atoms';
import { TokenManager } from '../../utils/tokenManager';

interface DurationSelectionScreenProps {
  location: ParkingLocation;
  tokenBalance: TokenBalance;
  onSelectDuration: (duration: ParkingDuration, isPriority: boolean) => void;
  onBackPress: () => void;
}

export const DurationSelectionScreen: React.FC<DurationSelectionScreenProps> = ({
  location,
  tokenBalance,
  onSelectDuration,
  onBackPress,
}) => {
  const [selectedDuration, setSelectedDuration] = useState<ParkingDuration | null>(null);
  const [isPrioritySelected, setIsPrioritySelected] = useState(false);

  const calculateTotalTokens = (duration: ParkingDuration | null, priority: boolean) => {
    if (!duration) return 0;
    return duration.tokens + (priority ? PRIORITY_PARKING_TOKENS : 0);
  };

  const canAfford = (tokens: number) => tokenBalance.currentTokens >= tokens;

  const handleContinue = () => {
    if (selectedDuration) {
      onSelectDuration(selectedDuration, isPrioritySelected);
    }
  };

  const totalTokensRequired = calculateTotalTokens(selectedDuration, isPrioritySelected);
  const canAffordSelection = canAfford(totalTokensRequired);

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
        <h1 className="text-lg font-semibold text-gray-900">Select Duration</h1>
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

        {/* Duration Options */}
        <div className="mb-8">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Select parking duration</h3>
          
          <div className="grid gap-4">
            {PARKING_DURATIONS.map((duration) => {
              const isSelected = selectedDuration?.hours === duration.hours;
              const isAffordable = canAfford(duration.tokens);
              
              return (
                <button
                  key={duration.hours}
                  onClick={() => setSelectedDuration(duration)}
                  disabled={!isAffordable}
                  className={`relative p-6 rounded-2xl border-2 text-left transition-all transform ${
                    isSelected
                      ? 'border-blue-500 bg-blue-50 shadow-lg scale-105'
                      : isAffordable
                      ? 'border-gray-200 bg-white hover:border-blue-300 hover:shadow-lg hover:scale-105'
                      : 'border-gray-200 bg-gray-50 opacity-50 cursor-not-allowed'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-lg font-bold text-gray-900">{duration.label}</div>
                      <div className="text-sm text-gray-600">Perfect for {duration.hours <= 3 ? 'quick visits' : duration.hours <= 6 ? 'half day' : 'full day'}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-blue-600">{duration.tokens}</div>
                      <div className="text-sm text-gray-500">token{duration.tokens !== 1 ? 's' : ''}</div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Priority Parking */}
        <div className="mb-8">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Priority options</h3>
          
          <button
            onClick={() => setIsPrioritySelected(!isPrioritySelected)}
            disabled={!canAfford(PRIORITY_PARKING_TOKENS) || !selectedDuration}
            className={`relative w-full p-6 rounded-2xl border-2 text-left transition-all transform ${
              isPrioritySelected
                ? 'border-purple-500 bg-purple-50 shadow-lg scale-105'
                : canAfford(PRIORITY_PARKING_TOKENS) && selectedDuration
                ? 'border-gray-200 bg-white hover:border-purple-300 hover:shadow-lg hover:scale-105'
                : 'border-gray-200 bg-gray-50 opacity-50 cursor-not-allowed'
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="text-lg font-bold text-gray-900">Priority Parking</div>
                <div className="text-sm text-gray-600">Best available spots, closer to entrance</div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-purple-600">+{PRIORITY_PARKING_TOKENS}</div>
                <div className="text-sm text-gray-500">tokens</div>
              </div>
            </div>
          </button>
        </div>

        {/* Selection Summary */}
        {selectedDuration && (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-8">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Selection Summary</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Duration:</span>
                <span className="font-bold text-gray-900">{selectedDuration.label}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Base tokens:</span>
                <span className="font-bold text-blue-600">{selectedDuration.tokens}</span>
              </div>
              {isPrioritySelected && (
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Priority parking:</span>
                  <span className="font-bold text-purple-600">+{PRIORITY_PARKING_TOKENS}</span>
                </div>
              )}
              <div className="border-t border-gray-200 pt-3 mt-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-gray-900">Total tokens:</span>
                  <span className={`text-2xl font-bold ${canAffordSelection ? 'text-gray-900' : 'text-red-600'}`}>
                    {totalTokensRequired}
                  </span>
                </div>
              </div>
              {!canAffordSelection && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 mt-3">
                  <p className="text-red-700 text-sm font-medium">
                    ⚠️ Insufficient tokens. You need {totalTokensRequired - tokenBalance.currentTokens} more tokens.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Continue Button */}
        <Button
          onClick={handleContinue}
          disabled={!selectedDuration || !canAffordSelection}
          variant="primary"
          className={`w-full font-bold py-4 px-8 text-lg rounded-2xl shadow-lg transition-all duration-200 transform ${
            !selectedDuration || !canAffordSelection
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 hover:shadow-xl hover:scale-105 text-white'
          }`}
        >
          Continue to Confirmation →
        </Button>
      </div>
    </div>
  );
};