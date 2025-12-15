import { ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '../../lib/utils';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'ghost';
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', ...props }, ref) => {
    const styles = {
      primary:
        'bg-gradient-to-r from-brand-900 to-brand-600 text-white shadow-card hover:opacity-95',
      secondary:
        'border border-slate-300 bg-white text-slate-900 hover:border-brand-500 hover:text-brand-700',
      ghost: 'text-brand-700 hover:bg-slate-100'
    }[variant];

    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-semibold transition-colors disabled:opacity-60',
          styles,
          className
        )}
        {...props}
      />
    );
  }
);

Button.displayName = 'Button';
