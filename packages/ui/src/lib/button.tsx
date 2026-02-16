import React from 'react';
import { cn } from './utils.js';

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
}

export const Button = ({
  className,
  variant = 'primary',
  ...props
}: ButtonProps) => {
  return (
    <button
      className={cn(
        'px-4 py-2 rounded-md font-medium transition-colors',
        variant === 'primary' && 'bg-blue-600 text-white hover:bg-blue-700',
        variant === 'secondary' &&
          'bg-gray-200 text-gray-800 hover:bg-gray-300',
        className
      )}
      {...props}
    />
  );
};
