import React from 'react';
import { cn } from '@/lib/utils';

interface PixelButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'accent' | 'destructive' | 'warning';
  size?: 'sm' | 'default' | 'lg';
}

export const PixelButton = React.forwardRef<HTMLButtonElement, PixelButtonProps>(
  ({ className, variant = 'default', size = 'default', children, ...props }, ref) => {
    
    const baseStyles = "relative inline-flex items-center justify-center font-heading text-xs uppercase tracking-widest border-3 border-black shadow-pixel transition-all active:translate-x-[2px] active:translate-y-[2px] active:shadow-pixel-sm disabled:opacity-50 disabled:pointer-events-none group";
    
    const variants = {
      default: "bg-secondary text-foreground hover:bg-secondary/80",
      accent: "bg-accent text-black hover:bg-accent/80",
      destructive: "bg-destructive text-foreground hover:bg-destructive/80",
      warning: "bg-warning text-black hover:bg-warning/80",
    };
    
    const sizes = {
      sm: "h-8 px-3 text-[10px]",
      default: "h-12 px-6",
      lg: "h-16 px-8 text-sm",
    };

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {children}
      </button>
    );
  }
);

PixelButton.displayName = "PixelButton";
