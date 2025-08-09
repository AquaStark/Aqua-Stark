import * as React from 'react';
import { ChevronDown } from 'lucide-react';

interface SelectProps {
  value: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  children: React.ReactNode;
}

export const Select = ({
  value,
  onValueChange,
  placeholder,
  children,
}: SelectProps) => {
  return (
    <div className='relative w-full'>
      <select
        className='w-full bg-white text-black py-2 px-3 rounded-md border border-gray-300 appearance-none'
        value={value}
        onChange={e => onValueChange(e.target.value)}
      >
        <option value=''>{placeholder || 'Select an option'}</option>
        {children}
      </select>
      <ChevronDown
        className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none'
        size={16}
      />
    </div>
  );
};

interface SelectItemProps {
  value: string;
  label: string;
}

export const SelectItem = ({ value, label }: SelectItemProps) => {
  return <option value={value}>{label}</option>;
};
