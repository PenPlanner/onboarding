import React from 'react';
import { cn } from '../../lib/utils';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'success' | 'warning' | 'error' | 'info' | 'neutral';
  children: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({
  variant = 'neutral',
  children,
  className,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium';
  
  const variants = {
    success: 'bg-success-100 text-success-700 border border-success-200',
    warning: 'bg-warning-100 text-warning-700 border border-warning-200',
    error: 'bg-red-100 text-red-700 border border-red-200',
    info: 'bg-primary-100 text-primary-700 border border-primary-200',
    neutral: 'bg-gray-100 text-gray-700 border border-gray-200'
  };

  return (
    <span
      className={cn(baseStyles, variants[variant], className)}
      {...props}
    >
      {children}
    </span>
  );
};