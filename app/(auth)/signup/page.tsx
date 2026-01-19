'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) {
      toast.error('Заполните все поля');
      return;
    }

    if (password.length < 6) {
      toast.error('Пароль должен быть не менее 6 символов');
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch('/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Ошибка регистрации');
      }

      toast.success('Аккаунт создан');
      router.push('/login');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Ошибка регистрации');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-sm">
      {/* Logo */}
      <div className="flex items-center justify-center gap-3 mb-10">
        <div className="relative w-12 h-12">
          <Image
            src="https://cdn.abacus.ai/images/9c860aec-6088-4ded-9ecd-91672e0ead25.png"
            alt="FOX YVN"
            fill
            className="object-contain"
          />
        </div>
        <span className="text-2xl font-semibold text-white">FOX YVN</span>
      </div>

      {/* Form */}
      <div className="bg-dark-elevated rounded-2xl border border-white/[0.08] p-8">
        <h1 className="text-xl font-semibold text-white text-center mb-6">Создать аккаунт</h1>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[13px] text-text-muted mb-2">Имя</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ваше имя"
              className="w-full"
              disabled={isLoading}
            />
          </div>

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
                placeholder="Минимум 6 символов"
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
                Создание...
              </>
            ) : (
              'Создать аккаунт'
            )}
          </button>
        </form>

        <p className="text-center text-[13px] text-text-muted mt-6">
          Уже есть аккаунт?{' '}
          <Link href="/login" className="text-white hover:text-white/80">
            Войти
          </Link>
        </p>
      </div>
    </div>
  );
}
