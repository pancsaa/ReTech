import React from 'react';

type SimpleButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  children: React.ReactNode;
  className?: string;
};

export const SimpleButton = ({ children, className = '', ...props }: SimpleButtonProps) => (
  <button
    className={`px-4 py-2 bg-green-300 text-black rounded-md hover:bg-green-500 transition-colors disabled:opacity-50 ${className}`}
    {...props}
  >
    {children}
  </button>
);