import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'FOX YVN - Вход',
};

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-dark-primary flex items-center justify-center p-4">
      {children}
    </div>
  );
}
