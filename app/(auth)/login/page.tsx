'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Заполните все поля');
      return;
    }

    setIsLoading(true);
    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        toast.error('Неверный email или пароль');
      } else {
        router.replace('/dashboard');
      }
    } catch {
      toast.error('Ошибка входа');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-sm">
      {/* Logo - большой и по центру */}
      <div className="flex items-center justify-center mb-12">
        <div className="relative w-28 h-28">
          <Image
            src="https://cdn.abacus.ai/images/9c860aec-6088-4ded-9ecd-91672e0ead25.png"
            alt="FOX YVN"
            fill
            className="object-contain"
          />
        </div>
      </div>

      {/* Form */}
      <div className="bg-dark-tertiary/60 backdrop-blur-xl rounded-2xl border border-white/[0.08] p-8">
        <h1 className="text-xl font-semibold text-white text-center mb-6">Вход в аккаунт</h1>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[13px] text-text-muted mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full"
              disabled={isLoading}
            />
          </div>
          
          <div>
            <label className="block text-[13px] text-text-muted mb-2">Пароль</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pr-10"
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="btn-primary w-full py-3 flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Вход...
              </>
            ) : (
              'Войти'
            )}
          </button>
        </form>

        <p className="text-center text-[13px] text-text-muted mt-6">
          Нет аккаунта?{' '}
          <Link href="/signup" className="text-white hover:text-white/80">
            Зарегистрироваться
          </Link>
        </p>
      </div>
    </div>
  );
}
