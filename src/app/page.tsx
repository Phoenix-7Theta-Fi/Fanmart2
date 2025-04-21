'use client';

import { AuthComponent } from '@/components/auth/AuthComponent';
import Dashboard from './dashboard/page';

export default function Home() {
  return (
    <AuthComponent>
      <Dashboard />
    </AuthComponent>
  );
}
