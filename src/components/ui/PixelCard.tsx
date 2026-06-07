import React from 'react';
import { cn } from '@/lib/utils';

interface PixelCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'dark' | 'dialog';
}

export const PixelCard = React.forwardRef<HTMLDivElement, PixelCardProps>(
  ({ className, variant = 'default', children, ...props }, ref) => {
    
    const baseStyles = "border-3 border-black shadow-pixel overflow-hidden";
    
    const variants = {
      default: "bg-primary text-foreground",
      dark: "bg-background text-foreground",
      dialog: "bg-primary text-foreground p-6",
    };

    return (
      <div
        ref={ref}
        className={cn(baseStyles, variants[variant], className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);

PixelCard.displayName = "PixelCard";
