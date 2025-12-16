import { DashboardLayout } from '../../components/DashboardLayout';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';

export default function SecuritySettingsPage() {
  return (
    <DashboardLayout title="Security Settings" subtitle="Review account security and session controls">
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="p-5">
          <p className="text-sm font-semibold text-primary dark:text-neutral-100">Sessions</p>
          <p className="mt-2 text-sm text-neutral-700 dark:text-neutral-200">Sign out of all devices and rotate tokens.</p>
          <div className="mt-3 flex gap-2">
            <Button variant="secondary">Sign out everywhere</Button>
            <Button variant="ghost">Rotate tokens</Button>
          </div>
        </Card>
        <Card className="p-5">
          <p className="text-sm font-semibold text-primary dark:text-neutral-100">2FA</p>
          <p className="mt-2 text-sm text-neutral-700 dark:text-neutral-200">
            Enable two-factor authentication for your account. Use TOTP or email codes as configured by your admin.
          </p>
          <Button className="mt-3" variant="secondary">
            Configure 2FA
          </Button>
        </Card>
      </div>
    </DashboardLayout>
  );
}
