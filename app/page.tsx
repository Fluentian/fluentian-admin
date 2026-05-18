import { redirect } from 'next/navigation';

export default function RootPage() {
  // Middleware handles the actual logic, but we default to dashboard
  redirect('/dashboard');
}
