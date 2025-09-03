import React from 'react';
import { Button } from '../atoms';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { Box, Typography, Paper, Container } from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';

export interface DateTimeSelectionScreenProps {
  onNext: () => void;
  onBack: () => void;
}

export const DateTimeSelectionScreen: React.FC<DateTimeSelectionScreenProps> = ({
  onNext,
  onBack,
}) => {
  const [selectedDate, setSelectedDate] = React.useState<Dayjs | null>(null);
  const [selectedTime, setSelectedTime] = React.useState<Dayjs | null>(null);

  const handleDateSelect = (date: Dayjs | null) => {
    setSelectedDate(date);
  };

  const handleTimeSelect = (time: Dayjs | null) => {
    setSelectedTime(time);
  };

  const handleNext = () => {
    if (selectedDate && selectedTime) {
      onNext();
    }
  };

  const canProceed = selectedDate && selectedTime;

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box textAlign="center" mb={4}>
          <Typography variant="h3" component="h1" gutterBottom>
            Select Date & Time
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Choose when you want to park
          </Typography>
        </Box>

        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr' }, gap: 4 }}>
          {/* Date Selection */}
          <Paper elevation={3} sx={{ p: 4 }}>
            <Typography variant="h5" component="h2" gutterBottom>
              Select Date
            </Typography>
            <DatePicker
              label="Choose a date"
              value={selectedDate}
              onChange={handleDateSelect}
              minDate={dayjs()}
              maxDate={dayjs().add(14, 'day')}
              slotProps={{
                textField: {
                  fullWidth: true,
                  variant: 'outlined',
                  size: 'medium'
                }
              }}
            />
          </Paper>

          {/* Time Selection */}
          <Paper elevation={3} sx={{ p: 4 }}>
            <Typography variant="h5" component="h2" gutterBottom>
              Select Time
            </Typography>
            <TimePicker
              label="Choose a time"
              value={selectedTime}
              onChange={handleTimeSelect}
              minTime={dayjs().hour(6).minute(0)}
              maxTime={dayjs().hour(22).minute(0)}
              slotProps={{
                textField: {
                  fullWidth: true,
                  variant: 'outlined',
                  size: 'medium'
                }
              }}
            />
          </Paper>
        </Box>

        {/* Navigation */}
        <Box display="flex" justifyContent="space-between" mt={4}>
          <Button
            onClick={onBack}
            variant="secondary"
            size="medium"
          >
            Back
          </Button>
          <Button
            onClick={handleNext}
            variant="primary"
            size="medium"
            disabled={!canProceed}
          >
            Next
          </Button>
        </Box>
      </Container>
    </LocalizationProvider>
  );
};
