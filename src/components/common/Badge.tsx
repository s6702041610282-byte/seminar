import React from 'react';

type BadgeVariant = 'success' | 'warning' | 'danger' | 'info' | 'neutral';
type BadgeSize = 'sm' | 'md';

interface BadgeProps {
  variant: BadgeVariant;
  children: React.ReactNode;
  size?: BadgeSize;
}

export const Badge: React.FC<BadgeProps> = ({ variant, children, size = 'sm' }) => {
  const variantStyles: Record<BadgeVariant, string> = {
    success: 'bg-green-100 text-green-800 border-green-200',
    warning: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    danger: 'bg-red-100 text-red-800 border-red-200',
    info: 'bg-brand-100 text-brand-800 border-brand-200',
    neutral: 'bg-gray-100 text-gray-800 border-gray-200',
  };

  const sizeStyles: Record<BadgeSize, string> = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-3 py-1',
  };

  return (
    <span className={`inline-flex items-center justify-center font-medium rounded-full border ${variantStyles[variant]} ${sizeStyles[size]} font-sans`}>
      {children}
    </span>
  );
};

export default Badge;
