import React, { useState, useEffect } from 'react';
import { ParkingFlowStep, ParkingLocation, ParkingSession, Vehicle, PaymentMethod, ParkingDuration, TokenBalance, DateTimeSelection } from './types';
import { LocationScreen } from './components/screens/LocationScreen';
import { DateTimeSelectionScreen } from './components/screens/DateTimeSelectionScreen';
import { DurationSelectionScreen } from './components/screens/DurationSelectionScreen';
import { ConfirmationScreen } from './components/screens/ConfirmationScreen';
import { ActiveParkingScreen } from './components/screens/ActiveParkingScreen';
import { SessionSummaryScreen } from './components/screens/SessionSummaryScreen';
import { TokenManager } from './utils/tokenManager';
import './App.css';

function App() {
  const [currentStep, setCurrentStep] = useState<ParkingFlowStep>('location');
  const [currentSession, setCurrentSession] = useState<ParkingSession | null>(null);
  const [currentUser] = useState('John Doe'); // Mock current user
  const [selectedDateTime, setSelectedDateTime] = useState<DateTimeSelection | null>(null);
  const [selectedDuration, setSelectedDuration] = useState<ParkingDuration | null>(null);
  const [isPrioritySelected, setIsPrioritySelected] = useState(false);
  const [tokenBalance, setTokenBalance] = useState<TokenBalance | null>(null);

  // Mock data
  const mockLocation: ParkingLocation = {
    name: 'Public Casual 2',
    address: '146 Dominion Road, Mount Eden, Auckland, New Zealand',
    availableSpaces: 2,
    pricing: {
      hourlyRate: 5.00,
      maxDailyRate: 10.00,
      processingFee: 0.50
    },
    closingTime: '11:30pm'
  };

  const mockVehicle: Vehicle = {
    type: 'car',
    licensePlate: 'ABC123'
  };

  const mockPaymentMethod: PaymentMethod = {
    type: 'card',
    last4: '4242'
  };

  // Initialize token balance
  useEffect(() => {
    const balance = TokenManager.getUserTokenBalance(currentUser);
    setTokenBalance(balance);
  }, [currentUser]);

  const handleStartParking = () => {
    setCurrentStep('datetime');
  };

  const handleReserveSpace = () => {
    setCurrentStep('datetime');
  };

  const handleSelectDateTime = (dateTime: DateTimeSelection) => {
    setSelectedDateTime(dateTime);
    setCurrentStep('duration');
  };

  const handleSelectDuration = (duration: ParkingDuration, isPriority: boolean) => {
    setSelectedDuration(duration);
    setIsPrioritySelected(isPriority);
    setCurrentStep('confirmation');
  };

  const handleConfirmParking = () => {
    if (!selectedDuration || !tokenBalance || !selectedDateTime) return;
    
    const totalTokens = TokenManager.calculateTotalTokens(selectedDuration.hours, isPrioritySelected);
    
    // Create scheduled start time from selected date and time
    const scheduledStart = new Date(selectedDateTime.date);
    const [hours, minutes] = selectedDateTime.startTime.split(':').map(Number);
    scheduledStart.setHours(hours, minutes, 0, 0);
    
    const isImmediateStart = scheduledStart.getTime() <= Date.now() + (5 * 60 * 1000); // Within 5 minutes
    
    // Spend tokens
    if (TokenManager.spendTokens(currentUser, totalTokens, `Parking session: ${selectedDuration.label}${isPrioritySelected ? ' (Priority)' : ''}`, Date.now().toString())) {
      // Create new session
      const newSession: ParkingSession = {
        id: Date.now().toString(),
        employeeName: currentUser,
        startTime: isImmediateStart ? new Date().toISOString() : scheduledStart.toISOString(),
        scheduledStartTime: scheduledStart.toISOString(),
        location: mockLocation,
        vehicle: mockVehicle,
        cost: 0,
        status: isImmediateStart ? 'active' : 'scheduled',
        tokensUsed: totalTokens,
        duration: selectedDuration,
        isPriority: isPrioritySelected
      };
      
      setCurrentSession(newSession);
      setCurrentStep(isImmediateStart ? 'active' : 'summary');
      
      // Update token balance
      const updatedBalance = TokenManager.getUserTokenBalance(currentUser);
      setTokenBalance(updatedBalance);
    } else {
      alert('Insufficient tokens!');
    }
  };

  const handleStopParking = () => {
    if (currentSession) {
      const completedSession: ParkingSession = {
        ...currentSession,
        endTime: new Date().toISOString(),
        status: 'completed'
      };

      setCurrentSession(completedSession);
      setCurrentStep('summary');
    }
  };

  const handleSupport = () => {
    alert('Support feature coming soon!');
  };

  const handleBackPress = () => {
    switch (currentStep) {
      case 'datetime':
        setCurrentStep('location');
        break;
      case 'duration':
        setCurrentStep('datetime');
        break;
      case 'confirmation':
        setCurrentStep('duration');
        break;
      case 'active':
        setCurrentStep('confirmation');
        break;
      case 'summary':
        setCurrentStep('location');
        setCurrentSession(null);
        setSelectedDateTime(null);
        setSelectedDuration(null);
        setIsPrioritySelected(false);
        break;
      default:
        break;
    }
  };

  const handleNewSession = () => {
    setCurrentStep('location');
    setCurrentSession(null);
    setSelectedDateTime(null);
    setSelectedDuration(null);
    setIsPrioritySelected(false);
  };

  const renderCurrentScreen = () => {
    if (!tokenBalance) {
      return <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>;
    }

    switch (currentStep) {
      case 'location':
        return (
          <LocationScreen
            location={mockLocation}
            tokenBalance={tokenBalance}
            onStartParking={handleStartParking}
            onReserveSpace={handleReserveSpace}
            onBackPress={() => {}}
          />
        );
      
      case 'datetime':
        return (
          <DateTimeSelectionScreen
            location={mockLocation}
            tokenBalance={tokenBalance}
            onSelectDateTime={handleSelectDateTime}
            onBackPress={handleBackPress}
          />
        );
      
      case 'duration':
        return (
          <DurationSelectionScreen
            location={mockLocation}
            tokenBalance={tokenBalance}
            onSelectDuration={handleSelectDuration}
            onBackPress={handleBackPress}
          />
        );
      
      case 'confirmation':
        return selectedDuration ? (
          <ConfirmationScreen
            location={mockLocation}
            vehicle={mockVehicle}
            paymentMethod={mockPaymentMethod}
            duration={selectedDuration}
            isPriority={isPrioritySelected}
            tokenBalance={tokenBalance}
            selectedDateTime={selectedDateTime || undefined}
            onConfirm={handleConfirmParking}
            onBackPress={handleBackPress}
          />
        ) : null;
      
      case 'active':
        return currentSession ? (
          <ActiveParkingScreen
            session={currentSession}
            onStopParking={handleStopParking}
            onSupport={handleSupport}
            onBackPress={handleBackPress}
          />
        ) : null;
      
      case 'summary':
        return currentSession ? (
          <SessionSummaryScreen
            session={currentSession}
            onBackPress={handleBackPress}
            onNewSession={handleNewSession}
          />
        ) : null;
      
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {renderCurrentScreen()}
    </div>
  );
}

export default App;
