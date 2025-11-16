import React from 'react';
import { getInitials } from '@/utils/task.utils';
import clsx from 'clsx';

interface AvatarProps {
  name?: string;
  src?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const Avatar: React.FC<AvatarProps> = ({
  name,
  src,
  size = 'md',
  className,
}) => {
  const sizes = {
    sm: 'w-6 h-6 text-xs',
    md: 'w-8 h-8 text-sm',
    lg: 'w-10 h-10 text-base',
  };
  
  const baseStyles = 'rounded-full flex items-center justify-center font-medium flex-shrink-0';
  
  if (src) {
    return (
      <img
        src={src}
        alt={name || 'Avatar'}
        className={clsx(baseStyles, sizes[size], className)}
      />
    );
  }
  
  const initials = name ? getInitials(name) : '?';
  const bgColor = name 
    ? 'bg-primary-500 text-white'
    : 'bg-neutral-300 text-neutral-600';
  
  return (
    <div
      className={clsx(
        baseStyles,
        sizes[size],
        bgColor,
        className
      )}
      aria-label={name || 'User avatar'}
    >
      {initials}
    </div>
  );
};

