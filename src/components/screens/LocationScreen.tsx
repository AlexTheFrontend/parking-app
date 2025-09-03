import React from 'react';
import { ParkingLocation, TokenBalance } from '../../types';
import { Button } from '../atoms';
import { TokenManager } from '../../utils/tokenManager';

interface LocationScreenProps {
  location: ParkingLocation;
  tokenBalance: TokenBalance;
  onStartParking: () => void;
  onReserveSpace: () => void;
  onBackPress: () => void;
}

export const LocationScreen: React.FC<LocationScreenProps> = ({
  location,
  tokenBalance,
  onStartParking,
  onReserveSpace,
  onBackPress,
}) => {
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
        <h1 className="text-lg font-semibold text-gray-900">Select Location</h1>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Hero Section */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{location.name}</h1>
          <p className="text-gray-600">{location.address}</p>
        </div>

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

        {/* Location Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Location Details */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Location Details</h3>
            <div className="space-y-4">
              <div>
                <div className="text-gray-900 font-medium">{location.address}</div>
                <button className="text-blue-600 text-sm hover:text-blue-700 transition-colors">Get directions →</button>
              </div>

              <div className="text-gray-700">
                <strong>Hours:</strong> Closes at {location.closingTime}
              </div>

              <div className="text-gray-700">
                <strong>Availability:</strong> {location.availableSpaces} spaces available
              </div>
            </div>
          </div>

          {/* Token Pricing */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Token Pricing</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2">
                <span className="text-gray-700">3 hours</span>
                <span className="font-semibold text-blue-600">1 token</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-gray-700">6 hours</span>
                <span className="font-semibold text-blue-600">2 tokens</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-gray-700">9 hours</span>
                <span className="font-semibold text-blue-600">3 tokens</span>
              </div>
              <div className="border-t pt-3 mt-3">
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-700">Priority parking</span>
                  <span className="font-semibold text-purple-600">+5 tokens</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">Closer spots, premium access</p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Button
            onClick={onStartParking}
            variant="primary"
            className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
          >
            Start Parking
          </Button>

          <Button
            onClick={onReserveSpace}
            variant="secondary"
            className="flex-1 bg-white hover:bg-gray-50 text-gray-700 font-semibold py-4 px-8 rounded-xl border-2 border-gray-200 hover:border-gray-300 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
          >
            Reserve Space
          </Button>
        </div>
      </div>
    </div>
  );
};
