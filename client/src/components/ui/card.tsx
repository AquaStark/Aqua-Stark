// components/ui/Card.tsx
import React from 'react';
import { cn } from "@/lib/utils";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
}

export const Card: React.FC<CardProps> = ({ 
  children, 
  className, 
  title, 
  ...props 
}) => {
  return (
    <div 
      className={cn(
        'bg-blue-800/50 backdrop-blur-sm rounded-lg p-6 border border-blue-600/50',
        className
      )}
      {...props}
    >
      {title && (
        <div className="text-lg font-medium mb-4 border-b border-blue-600/30 pb-2">
          {title}
        </div>
      )}
      {children}
    </div>
  );
};