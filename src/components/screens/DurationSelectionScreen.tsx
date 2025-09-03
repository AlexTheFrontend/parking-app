import React from 'react';
import { Button } from '../atoms';

export interface DurationSelectionScreenProps {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  duration: number;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  isPriority: boolean;
  onNext: () => void;
  onBack: () => void;
}

export const DurationSelectionScreen: React.FC<DurationSelectionScreenProps> = ({
  duration, // eslint-disable-line @typescript-eslint/no-unused-vars
  isPriority, // eslint-disable-line @typescript-eslint/no-unused-vars
  onNext,
  onBack,
}) => {
  const [selectedDuration, setSelectedDuration] = React.useState<number | null>(null);
  const [isPrioritySelected, setIsPrioritySelected] = React.useState(false);

  const availableDurations = [
    { value: 1, label: '1 Hour', tokens: 1 },
    { value: 2, label: '2 Hours', tokens: 2 },
    { value: 4, label: '4 Hours', tokens: 4 },
    { value: 8, label: '8 Hours', tokens: 8 },
  ];

  const priorityTokens = 2;

  const calculateTotalTokens = (duration: number | null, priority: boolean) => {
    if (!duration) {return 0;}
    const baseTokens = availableDurations.find(d => d.value === duration)?.tokens || 0;
    return priority ? baseTokens + priorityTokens : baseTokens;
  };

  const handleDurationSelect = (durationValue: number) => {
    setSelectedDuration(durationValue);
  };

  const handlePriorityToggle = () => {
    setIsPrioritySelected(!isPrioritySelected);
  };

  const handleNext = () => {
    if (selectedDuration) {
      onNext();
    }
  };

  const canProceed = selectedDuration !== null;
  const totalTokens = calculateTotalTokens(selectedDuration, isPrioritySelected);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Select Duration</h1>
          <p className="text-lg text-gray-600">How long do you need to park?</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Duration Selection */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Parking Duration</h2>
            <div className="grid grid-cols-2 gap-4">
              {availableDurations.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleDurationSelect(option.value)}
                  className={`p-6 rounded-xl border-2 transition-all duration-200 ${
                    selectedDuration === option.value
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                  }`}
                >
                  <div className="text-lg font-bold">{option.label}</div>
                  <div className="text-sm text-gray-500">{option.tokens} tokens</div>
                </button>
              ))}
            </div>
          </div>

          {/* Priority Selection */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Priority Parking</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border-2 border-gray-200 rounded-xl">
                <div>
                  <div className="font-medium text-gray-900">Standard Parking</div>
                  <div className="text-sm text-gray-500">Regular availability</div>
                </div>
                <div className="text-lg font-bold text-gray-900">0 tokens</div>
              </div>

              <button
                onClick={handlePriorityToggle}
                className={`w-full p-4 rounded-xl border-2 transition-all duration-200 ${
                  isPrioritySelected
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Priority Parking</div>
                    <div className="text-sm text-gray-500">Guaranteed spot + 2 tokens</div>
                  </div>
                  <div className="text-lg font-bold">+2 tokens</div>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Token Summary */}
        {selectedDuration && (
          <div className="bg-white rounded-2xl shadow-xl p-8 mt-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Token Summary</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Base Duration:</span>
                <span className="font-bold text-gray-900">
                  {availableDurations.find(d => d.value === selectedDuration)?.tokens} tokens
                </span>
              </div>
              {isPrioritySelected && (
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Priority Fee:</span>
                  <span className="font-bold text-gray-900">+{priorityTokens} tokens</span>
                </div>
              )}
              <div className="border-t pt-3">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-gray-900">Total:</span>
                  <span className="text-2xl font-bold text-blue-600">{totalTokens} tokens</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between mt-8">
          <Button
            onClick={onBack}
            variant="secondary"
            size="large"
          >
            Back
          </Button>
          <Button
            onClick={handleNext}
            variant="primary"
            size="large"
            disabled={!selectedDuration}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};
