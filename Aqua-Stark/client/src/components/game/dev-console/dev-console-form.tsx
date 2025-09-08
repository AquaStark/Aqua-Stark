/**
 * Dev Console Form - Reusable form wrapper component
 */

import React from 'react';

interface DevConsoleFormProps {
  title: string;
  borderColor?: string;
  children: React.ReactNode;
}

export const DevConsoleForm: React.FC<DevConsoleFormProps> = ({
  title,
  borderColor,
  children,
}) => {
  const borderClass = borderColor ? `border-l-4 ${borderColor}` : '';

  return (
    <div className={`bg-gray-800 p-4 rounded-lg ${borderClass}`}>
      <h2 className='text-xl font-bold mb-4 text-blue-300'>{title}</h2>
      {children}
    </div>
  );
};

interface DevConsoleInputProps {
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  className?: string;
}

export const DevConsoleInput: React.FC<DevConsoleInputProps> = ({
  placeholder,
  value,
  onChange,
  type = 'text',
  className = '',
}) => {
  return (
    <input
      className={`bg-gray-700 p-2 rounded-md placeholder-gray-500 w-full ${className}`}
      placeholder={placeholder}
      value={value}
      onChange={e => onChange(e.target.value)}
      type={type}
    />
  );
};

interface DevConsoleSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: string[];
  className?: string;
}

export const DevConsoleSelect: React.FC<DevConsoleSelectProps> = ({
  value,
  onChange,
  options,
  className = '',
}) => {
  return (
    <select
      className={`bg-gray-700 p-2 rounded-md w-full ${className}`}
      value={value}
      onChange={e => onChange(e.target.value)}
    >
      {options.map(option => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  );
};

interface DevConsoleButtonProps {
  onClick: () => void;
  disabled?: boolean;
  variant?: 'blue' | 'green' | 'red' | 'yellow' | 'purple' | 'pink';
  children: React.ReactNode;
  className?: string;
}

export const DevConsoleButton: React.FC<DevConsoleButtonProps> = ({
  onClick,
  disabled = false,
  variant = 'blue',
  children,
  className = '',
}) => {
  const getVariantClasses = (variant: string) => {
    const variants = {
      blue: 'bg-blue-600 hover:bg-blue-700',
      green: 'bg-green-600 hover:bg-green-700',
      red: 'bg-red-600 hover:bg-red-700',
      yellow: 'bg-yellow-600 hover:bg-yellow-700',
      purple: 'bg-purple-600 hover:bg-purple-700',
      pink: 'bg-pink-600 hover:bg-pink-700',
    };
    return variants[variant as keyof typeof variants] || variants.blue;
  };

  return (
    <button
      className={`${getVariantClasses(variant)} text-white p-2 rounded-md w-full ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};
