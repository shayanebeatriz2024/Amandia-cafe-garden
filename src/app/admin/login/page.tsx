import { isAdminConfigured } from '@/lib/admin/session';
import { LoginForm } from '@/components/admin/LoginForm';

export const dynamic = 'force-dynamic';

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-svh items-center justify-center px-4 py-12">
      <LoginForm configured={isAdminConfigured()} />
    </div>
  );
}
