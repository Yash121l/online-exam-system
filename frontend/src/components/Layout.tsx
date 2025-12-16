import Head from 'next/head';
import Link from 'next/link';
import { ReactNode, useEffect, useState } from 'react';
import { cn } from '../lib/utils';
import { useThemeMode } from '../lib/theme';
import { getAuth, logout } from '../lib/api';

type Props = {
  title?: string;
  children: ReactNode;
};

export function Layout({ title, children }: Props) {
  const pageTitle = title ? `${title} | AegisExam` : 'AegisExam';
  const navLinks = [
    { href: '/', label: 'Product' },
    { href: '/features', label: 'Features' },
    { href: '/pricing', label: 'Pricing' },
    { href: '/security', label: 'Security' },
    { href: '/docs', label: 'Docs' }
  ];
  const footerSections = [
    {
      title: 'Product',
      links: [
        { href: '/features', label: 'Features' },
        { href: '/pricing', label: 'Pricing' },
        { href: '/dashboard/admin', label: 'Admin' },
        { href: '/dashboard/student', label: 'Student' }
      ]
    },
    {
      title: 'Resources',
      links: [
        { href: '/blog', label: 'Blog' },
        { href: '/docs', label: 'Documentation' },
        { href: '/security', label: 'Security' },
        { href: '/contact', label: 'Contact' }
      ]
    },
    {
      title: 'Company',
      links: [
        { href: '/about', label: 'About' },
        { href: '/careers', label: 'Careers' },
        { href: '/contact', label: 'Support' },
        { href: '/legal/privacy', label: 'Privacy' }
      ]
    },
    {
      title: 'Legal',
      links: [
        { href: '/legal/terms', label: 'Terms' },
        { href: '/legal/security', label: 'Security' },
        { href: '/legal/compliance', label: 'Compliance' },
        { href: '/legal/status', label: 'Status' }
      ]
    }
  ];

  const { theme, isDark, toggleTheme } = useThemeMode();
  const [user, setUser] = useState<{ email: string; role: string; firstName?: string | null; lastName?: string | null } | null>(null);

  useEffect(() => {
    const auth = getAuth();
    if (auth?.user) setUser(auth.user as any);
  }, []);

  const handleLogout = () => {
    logout();
    setUser(null);
  };

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <div className={cn('relative min-h-screen', isDark ? 'dark bg-neutral-900' : 'bg-neutral-50')}>
        <div className="pointer-events-none absolute inset-0 bg-hero-radial opacity-80 dark:opacity-20" />
        <header className="sticky top-0 z-20 border-b border-white/40 bg-white/80 backdrop-blur dark:border-neutral-800 dark:bg-neutral-900/80">
          <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-6 py-4">
            <Link href="/" className="text-lg font-bold tracking-tight text-primary dark:text-neutral-50">
              AegisExam
            </Link>
            <nav className="flex flex-wrap items-center gap-2 text-sm font-semibold text-slate-700 dark:text-neutral-200">
              {navLinks.map((item) => (
                <Link
                  key={item.href}
                  className="rounded-md px-3 py-2 hover:bg-slate-100 dark:hover:bg-neutral-800"
                  href={item.href}
                >
                  {item.label}
                </Link>
              ))}
              <Link className="rounded-md px-3 py-2 hover:bg-slate-100 dark:hover:bg-neutral-800" href="/exams/builder">
                Exam Builder
              </Link>
              <Link className="rounded-md px-3 py-2 hover:bg-slate-100 dark:hover:bg-neutral-800" href="/exams/launch">
                Secure App
              </Link>
              <Link className="rounded-md px-3 py-2 hover:bg-slate-100 dark:hover:bg-neutral-800" href="/dashboard/admin">
                Admin
              </Link>
              <Link className="rounded-md px-3 py-2 hover:bg-slate-100 dark:hover:bg-neutral-800" href="/dashboard/student">
                Student
              </Link>
            </nav>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={toggleTheme}
                className="rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm font-semibold text-neutral-700 shadow-sm hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100 dark:hover:bg-neutral-700"
                aria-label="Toggle theme"
              >
                {isDark ? '🌙 Dark' : '☀️ Light'}
              </button>
              {user ? (
                <>
                  <span className="rounded-lg border border-neutral-200 px-3 py-2 text-sm font-semibold text-neutral-700 dark:border-neutral-700 dark:text-neutral-100">
                    {user.firstName ?? user.email} · {user.role}
                  </span>
                  <Link
                    className="rounded-lg border border-neutral-200 px-3 py-2 text-sm font-semibold text-neutral-700 hover:bg-neutral-100 dark:border-neutral-700 dark:text-neutral-100 dark:hover:bg-neutral-800"
                    href="/profile"
                  >
                    Profile
                  </Link>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="rounded-lg border border-danger/20 px-3 py-2 text-sm font-semibold text-danger hover:bg-red-50 dark:border-danger/40 dark:text-danger dark:hover:bg-red-950/30"
                  >
                    Sign out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    className="rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 dark:text-neutral-100 dark:hover:bg-neutral-800"
                    href="/auth/login"
                  >
                    Sign In
                  </Link>
                  <Link
                    className="rounded-lg bg-gradient-to-r from-primary to-accent px-4 py-2 text-sm font-semibold text-white shadow-card hover:opacity-95"
                    href="/auth/register"
                  >
                    Start Free Trial
                  </Link>
                </>
              )}
            </div>
          </div>
        </header>

        <main className="relative z-10 px-4 py-8 sm:px-6 lg:px-10">{children}</main>

        <footer className="mt-16 border-t border-neutral-200 bg-white/70 backdrop-blur dark:border-neutral-800 dark:bg-neutral-900/70">
          <div className="mx-auto grid max-w-7xl gap-10 px-6 py-10 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="space-y-3">
              <p className="text-lg font-bold text-primary dark:text-neutral-50">AegisExam</p>
              <p className="max-w-xl text-sm text-neutral-600 dark:text-neutral-300">
                Secure, intelligent, and fair assessments with AI-assisted proctoring and a locked-down client experience.
              </p>
              <div className="flex flex-wrap gap-2 text-xs text-neutral-600 dark:text-neutral-400">
                <span className="rounded-full bg-neutral-100 px-3 py-1 dark:bg-neutral-800">SOC 2 Ready</span>
                <span className="rounded-full bg-neutral-100 px-3 py-1 dark:bg-neutral-800">GDPR Aligned</span>
                <span className="rounded-full bg-neutral-100 px-3 py-1 dark:bg-neutral-800">Accessibility-first</span>
              </div>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {footerSections.map((section) => (
                <div key={section.title} className="space-y-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary dark:text-neutral-100">
                    {section.title}
                  </p>
                  <div className="flex flex-col gap-2 text-sm text-neutral-700 dark:text-neutral-300">
                    {section.links.map((link) => (
                      <Link key={link.href} className="hover:text-accent" href={link.href}>
                        {link.label}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
