import React from 'react';

type SimpleInputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  className?: string;
};

export const SimpleInput = ({ type = "text", className = '', ...props }: SimpleInputProps) => (
  <input
    className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${className}`}
    type={type}
    {...props}
  />
);