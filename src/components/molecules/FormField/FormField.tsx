import React from 'react';
import { Input, InputProps } from '../../atoms/Input';

export interface FormFieldProps extends Omit<InputProps, 'id'> {
  label: string;
  id: string;
  helpText?: string;
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  id,
  helpText,
  error,
  required,
  ...inputProps
}) => {
  return (
    <div className="space-y-1">
      <label htmlFor={id} className="block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <Input
        id={id}
        name={id}
        error={error}
        required={required}
        {...inputProps}
      />
      {helpText && !error && (
        <p className="text-sm text-gray-500">{helpText}</p>
      )}
    </div>
  );
};