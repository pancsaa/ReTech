import React from 'react';

type SimpleLabelProps = React.LabelHTMLAttributes<HTMLLabelElement> & {
  className?: string;
  children: React.ReactNode;
};

export const SimpleLabel = ({ children, className = '', ...props }: SimpleLabelProps) => (
  <label className={`block text-sm font-medium text-gray-700 ${className}`} {...props}>
    {children}
  </label>
);