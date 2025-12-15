import Head from 'next/head';
import Link from 'next/link';
import { ReactNode } from 'react';

type Props = {
  title?: string;
  children: ReactNode;
};

export function Layout({ title, children }: Props) {
  const pageTitle = title ? `${title} | AegisExam` : 'AegisExam';

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <div className="min-h-screen bg-[radial-gradient(circle_at_15%_20%,#eef2ff,#f8fafc_40%,#ffffff_60%)]">
        <header className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white/90 px-6 py-4 backdrop-blur">
          <Link href="/" className="text-lg font-bold tracking-tight text-slate-900">
            AegisExam
          </Link>
          <nav className="flex gap-3 text-sm font-semibold text-slate-700">
            <Link className="rounded-md px-3 py-2 hover:bg-slate-100" href="/auth/login">
              Sign In
            </Link>
            <Link className="rounded-md px-3 py-2 hover:bg-slate-100" href="/auth/register">
              Sign Up
            </Link>
            <Link className="rounded-md px-3 py-2 hover:bg-slate-100" href="/dashboard/admin">
              Admin
            </Link>
            <Link className="rounded-md px-3 py-2 hover:bg-slate-100" href="/dashboard/student">
              Student
            </Link>
          </nav>
        </header>
        <main className="px-4 py-6 sm:px-6 lg:px-10">{children}</main>
      </div>
    </>
  );
}
