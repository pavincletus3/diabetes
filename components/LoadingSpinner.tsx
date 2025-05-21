
import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: string; // e.g., 'text-blue-500'
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ size = 'md', color = 'text-sky-400' }) => {
  let spinnerSizeClass = 'w-8 h-8';
  if (size === 'sm') spinnerSizeClass = 'w-5 h-5';
  if (size === 'lg') spinnerSizeClass = 'w-12 h-12';

  return (
    <div className={`animate-spin rounded-full border-t-2 border-b-2 border-transparent ${spinnerSizeClass} ${color}`} style={{borderTopColor: 'currentColor', borderBottomColor: 'currentColor', borderRightColor: 'transparent', borderLeftColor: 'transparent'}}></div>
  );
};
