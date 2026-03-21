'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';
import { Eye, EyeOff, Loader2, UtensilsCrossed } from 'lucide-react';
import { toast } from 'sonner';

export function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { user, login } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/admin/dashboard';

  useEffect(() => {
    if (user) router.replace(redirect);
  }, [user, router, redirect]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    try {
      await login(email, password, remember);
      router.replace(redirect);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Giriş başarısız';
      const friendly =
        message.includes('invalid-credential') || message.includes('wrong-password')
          ? 'E-posta veya şifre hatalı'
          : message.includes('too-many-requests')
          ? 'Çok fazla deneme. Lütfen bekleyin.'
          : 'Giriş yapılamadı. Tekrar deneyin.';
      toast.error(friendly);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-orange-500 text-white mb-4 shadow-lg">
            <UtensilsCrossed size={32} />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Paneli</h1>
          <p className="text-sm text-gray-500 mt-1">Yönetim paneline giriş yapın</p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">E-posta</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                placeholder="admin@restoran.com"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 transition-all"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1.5">Şifre</label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  placeholder="••••••••"
                  className="w-full px-4 py-2.5 pr-10 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                id="remember"
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="rounded border-gray-300 text-orange-500 focus:ring-orange-500"
              />
              <label htmlFor="remember" className="text-sm text-gray-600">Beni hatırla (7 gün)</label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={cn(
                'w-full py-2.5 px-4 rounded-xl font-medium text-sm text-white transition-all',
                'bg-orange-500 hover:bg-orange-600 active:bg-orange-700',
                'disabled:opacity-60 disabled:cursor-not-allowed',
                'flex items-center justify-center gap-2'
              )}
            >
              {isLoading ? (
                <><Loader2 size={16} className="animate-spin" />Giriş yapılıyor...</>
              ) : 'Giriş Yap'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
