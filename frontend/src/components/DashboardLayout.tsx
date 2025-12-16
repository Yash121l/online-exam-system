import Link from 'next/link';
import { ReactNode, useMemo } from 'react';
import { cn } from '../lib/utils';
import { useThemeMode } from '../lib/theme';
import { getAuth } from '../lib/api';

type NavItem = { href: string; label: string };

type Props = {
  title?: string;
  subtitle?: string;
  children: ReactNode;
};

export function DashboardLayout({ title, subtitle, children }: Props) {
  const { theme, isDark, toggleTheme } = useThemeMode();
  const role = getAuth()?.user?.role ?? 'GUEST';

  const navItems: NavItem[] = useMemo(() => {
    if (role === 'STUDENT') {
      return [
        { href: '/student/dashboard', label: 'Dashboard' },
        { href: '/student/exams', label: 'Exams' },
        { href: '/student/results', label: 'Results' },
        { href: '/exams/launch', label: 'Secure App' }
      ];
    }
    if (role === 'EVALUATOR') {
      return [
        { href: '/evaluator/dashboard', label: 'Dashboard' },
        { href: '/teacher/grading', label: 'Grading Queue' },
        { href: '/teacher/reports', label: 'Reports' }
      ];
    }
    return [
      { href: '/admin/dashboard', label: 'Overview' },
      { href: '/exams/builder', label: 'Exam Builder' },
      { href: '/dashboard/invigilation', label: 'Monitoring' },
      { href: '/teacher/reports', label: 'Reports' }
    ];
  }, [role]);

  return (
    <div className={cn('min-h-screen bg-neutral-50 dark:bg-neutral-900')}>
      <div className="flex min-h-screen">
        <aside className="hidden w-60 flex-col border-r border-neutral-200 bg-white/90 p-4 dark:border-neutral-800 dark:bg-neutral-900/80 md:flex">
          <Link href="/" className="text-lg font-bold text-primary dark:text-neutral-50">
            AegisExam
          </Link>
          <div className="mt-6 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block rounded-md px-3 py-2 text-sm font-semibold text-neutral-700 hover:bg-neutral-100 dark:text-neutral-200 dark:hover:bg-neutral-800"
              >
                {item.label}
              </Link>
            ))}
          </div>
          <div className="mt-auto pt-6 text-xs text-neutral-500 dark:text-neutral-400">
            <p>Role: {role}</p>
            <button
              type="button"
              onClick={toggleTheme}
              className="mt-2 w-full rounded-md border border-neutral-200 px-3 py-2 text-sm font-semibold text-neutral-700 hover:bg-neutral-100 dark:border-neutral-700 dark:text-neutral-100 dark:hover:bg-neutral-800"
            >
              {isDark ? '🌙 Dark' : '☀️ Light'} mode
            </button>
          </div>
        </aside>

        <div className="flex-1">
          <header className="sticky top-0 z-10 flex items-center justify-between border-b border-neutral-200 bg-white/90 px-4 py-3 backdrop-blur dark:border-neutral-800 dark:bg-neutral-900/80">
            <div>
              {title && <p className="text-lg font-bold text-primary dark:text-neutral-50">{title}</p>}
              {subtitle && <p className="text-sm text-neutral-600 dark:text-neutral-300">{subtitle}</p>}
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={toggleTheme}
                className="hidden rounded-md border border-neutral-200 px-3 py-2 text-sm font-semibold text-neutral-700 hover:bg-neutral-100 dark:border-neutral-700 dark:text-neutral-100 dark:hover:bg-neutral-800 sm:inline-flex"
              >
                {isDark ? '🌙 Dark' : '☀️ Light'}
              </button>
              <Link
                href="/auth/login"
                className="rounded-md border border-neutral-200 px-3 py-2 text-sm font-semibold text-neutral-700 hover:bg-neutral-100 dark:border-neutral-700 dark:text-neutral-100 dark:hover:bg-neutral-800"
              >
                Switch account
              </Link>
            </div>
          </header>
          <main className="px-4 py-6 sm:px-6 lg:px-8">{children}</main>
        </div>
      </div>
    </div>
  );
}
