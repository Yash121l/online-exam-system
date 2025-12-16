import { useMemo } from 'react';
import { DashboardLayout } from '../../components/DashboardLayout';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { getAuth, logout } from '../../lib/api';
import { useThemeMode } from '../../lib/theme';

export default function ProfilePage() {
  const auth = getAuth();
  const { toggleTheme, isDark } = useThemeMode();
  const displayName = useMemo(() => {
    if (!auth?.user) return 'Guest';
    return auth.user.firstName ? `${auth.user.firstName} ${auth.user.lastName ?? ''}`.trim() : auth.user.email;
  }, [auth?.user]);

  return (
    <DashboardLayout title="Profile" subtitle="Manage your account and preferences">
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="p-5">
          <p className="text-sm font-semibold text-primary dark:text-neutral-100">Account</p>
          <div className="mt-3 space-y-2 text-sm text-neutral-700 dark:text-neutral-200">
            <p>Name: {displayName}</p>
            <p>Email: {auth?.user?.email ?? 'Unknown'}</p>
            <p>Role: {auth?.user?.role ?? 'GUEST'}</p>
          </div>
          <div className="mt-4 flex gap-2">
            <Button variant="secondary" onClick={toggleTheme}>
              {isDark ? 'Use light mode' : 'Use dark mode'}
            </Button>
            <Button variant="ghost" onClick={() => logout()}>
              Sign out
            </Button>
          </div>
        </Card>
        <Card className="p-5">
          <p className="text-sm font-semibold text-primary dark:text-neutral-100">Security</p>
          <ul className="mt-2 space-y-2 text-sm text-neutral-700 dark:text-neutral-200">
            <li>• JWT-based auth; refresh tokens rotated on login.</li>
            <li>• Secure client launch required for high-stakes exams.</li>
            <li>• Contact support to rotate credentials or reset MFA.</li>
          </ul>
        </Card>
      </div>
    </DashboardLayout>
  );
}
