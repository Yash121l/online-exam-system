import { ButtonHTMLAttributes, ReactElement, cloneElement, forwardRef, isValidElement } from 'react';
import { cn } from '../../lib/utils';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'ghost';
  asChild?: boolean;
};

const variantStyles: Record<NonNullable<ButtonProps['variant']>, string> = {
  primary: 'bg-gradient-to-r from-brand-900 to-brand-600 text-white shadow-card hover:opacity-95',
  secondary: 'border border-slate-300 bg-white text-slate-900 hover:border-brand-500 hover:text-brand-700',
  ghost: 'text-brand-700 hover:bg-slate-100'
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', asChild = false, children, ...props }, ref) => {
    const classes = cn(
      'inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-semibold transition-colors disabled:opacity-60',
      variantStyles[variant],
      className
    );

    if (asChild && isValidElement(children)) {
      return cloneElement(children as ReactElement, {
        className: cn((children as ReactElement).props.className, classes)
      });
    }

    return (
      <button ref={ref} className={classes} {...props}>
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
