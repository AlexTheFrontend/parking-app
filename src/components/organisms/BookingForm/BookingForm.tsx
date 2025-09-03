import React, { useState } from 'react';
import { Button } from '../../atoms';
import { FormField } from '../../molecules';
import { BookingFormData } from '../../../types';

export interface BookingFormProps {
  onSubmit: (formData: BookingFormData) => Promise<void> | void;
  isLoading?: boolean;
  className?: string;
}

export const BookingForm: React.FC<BookingFormProps> = ({
  onSubmit,
  isLoading = false,
  className = '',
}) => {
  const [employeeName, setEmployeeName] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [errors, setErrors] = useState<{employeeName?: string; selectedDate?: string}>({});

  const validateForm = (): boolean => {
    const newErrors: {employeeName?: string; selectedDate?: string} = {};

    if (!employeeName.trim()) {
      newErrors.employeeName = 'Employee name is required';
    }

    if (!selectedDate) {
      newErrors.selectedDate = 'Booking date is required';
    } else {
      const selected = new Date(selectedDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (selected < today) {
        newErrors.selectedDate = 'Cannot book past dates';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const formData: BookingFormData = {
      employeeName: employeeName.trim(),
      selectedDate: selectedDate ? new Date(selectedDate) : null,
    };

    try {
      await onSubmit(formData);
      // Reset form on successful submission
      setEmployeeName('');
      setSelectedDate('');
      setErrors({});
    } catch (error) {
      // Handle error (could be passed via props or handled by parent)
      console.error('Booking submission failed:', error);
    }
  };

  const getTodayString = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  return (
      <div className={`bg-white rounded-lg shadow-lg p-6 animate-[slideInLeft_0.6s_ease-out] ${className}`}>
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          Book Parking Slot
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormField
            id="employeeName"
            label="Employee Name"
            type="text"
            placeholder="Enter your name"
            value={employeeName}
            onChange={(e) => {
              setEmployeeName(e.target.value);
              if (errors.employeeName) {
                setErrors(prev => ({ ...prev, employeeName: undefined }));
              }
            }}
            required
            error={errors.employeeName}
            helpText="This will be used to identify your booking"
          />
          
          <FormField
            id="bookingDate"
            label="Booking Date"
            type="date"
            value={selectedDate}
            onChange={(e) => {
              setSelectedDate(e.target.value);
              if (errors.selectedDate) {
                setErrors(prev => ({ ...prev, selectedDate: undefined }));
              }
            }}
            required
            error={errors.selectedDate}
            helpText="Select the date you need the parking slot"
            className="min-w-0"
            // Set minimum date to today
            {...({ min: getTodayString() })}
          />
          
          <Button
            type="submit"
            variant="primary"
            className="w-full mt-6"
            disabled={isLoading}
            loading={isLoading}
          >
            {isLoading ? 'Booking...' : 'Book Parking Slot'}
          </Button>
        </form>
      </div>
  );
};