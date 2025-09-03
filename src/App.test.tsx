import { render, screen } from '@testing-library/react';
import App from './App';

test('renders parking app title', () => {
  render(<App />);
  const titleElement = screen.getByText(/Parking Slot Booking/i);
  expect(titleElement).toBeInTheDocument();
});

test('renders booking form heading', () => {
  render(<App />);
  const formHeading = screen.getByRole('heading', { name: /Book Parking Slot/i });
  expect(formHeading).toBeInTheDocument();
});

test('renders employee name input', () => {
  render(<App />);
  const nameInput = screen.getByLabelText(/Employee Name/i);
  expect(nameInput).toBeInTheDocument();
});

test('renders booking date input', () => {
  render(<App />);
  const dateInput = screen.getByLabelText(/Booking Date/i);
  expect(dateInput).toBeInTheDocument();
});

test('renders submit button', () => {
  render(<App />);
  const submitButton = screen.getByRole('button', { name: /Book Parking Slot/i });
  expect(submitButton).toBeInTheDocument();
});
