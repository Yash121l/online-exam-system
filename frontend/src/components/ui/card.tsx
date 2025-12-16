import { cn } from '../../lib/utils';
import { HTMLAttributes } from 'react';

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'rounded-xl border border-slate-200 bg-white shadow-card transition hover:-translate-y-0.5 dark:border-neutral-800 dark:bg-neutral-900',
        className
      )}
      {...props}
    />
  );
}

export function CardHeader({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('text-sm font-semibold text-brand-700 dark:text-neutral-100', className)} {...props} />;
}

export function CardContent({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('text-slate-700 leading-relaxed dark:text-neutral-200', className)} {...props} />;
}
