'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  FolderOpen,
  FileText,
  Users,
  BarChart2,
  Settings,
  LogOut,
  UtensilsCrossed,
  Star,
  Globe,
  Tag,
  ChevronDown,
  ChevronRight,
  Type,
  Palette,
  Clock,
  Plug,
  Truck,
  Bell,
  LayoutGrid,
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

const navItems = [
  { label: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
  { label: 'Siparişler', href: '/admin/orders', icon: ShoppingBag },
  { label: 'Ürünler', href: '/admin/products', icon: Package },
  { label: 'Kategoriler', href: '/admin/categories', icon: FolderOpen },
  { label: 'Blog', href: '/admin/blog', icon: FileText },
  { label: 'Sayfalar', href: '/admin/pages', icon: Globe },
  { label: 'Yorumlar', href: '/admin/reviews', icon: Star },
  { label: 'Kuponlar', href: '/admin/coupons', icon: Tag },
  { label: 'Ziyaretçiler', href: '/admin/visitors', icon: Users },
  { label: 'Analitik', href: '/admin/analytics', icon: BarChart2 },
];

const settingsItems = [
  { label: 'Genel', href: '/admin/settings/general', icon: Settings, desc: 'Site adı, logo, iletişim' },
  { label: 'Sipariş', href: '/admin/settings/ordering', icon: Clock, desc: 'Çalışma saatleri, özel tatiller' },
  { label: 'İçerik', href: '/admin/settings/content', icon: Type, desc: 'Hero, hikaye, stats, CTA, footer metinleri' },
  { label: 'Görünüm', href: '/admin/settings/appearance', icon: Palette, desc: 'Tema, renkler, hero' },
  { label: 'Entegrasyonlar', href: '/admin/settings/integrations', icon: Plug, desc: 'Medya sağlayıcı (Cloudinary/ImgBB)' },
  { label: 'Düzen', href: '/admin/settings/layout', icon: LayoutGrid, desc: 'Mobil/Tablet/Masaüstü özelleştirme' },
  { label: 'Teslimat', href: '/admin/settings/delivery', icon: Truck, desc: 'Teslimat bölgeleri' },
  { label: 'Bildirimler', href: '/admin/settings/notifications', icon: Bell, desc: 'SMS, WhatsApp' },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const { logout } = useAuth();
  const isSettingsOpen = pathname.startsWith('/admin/settings');
  const [settingsExpanded, setSettingsExpanded] = useState(isSettingsOpen);

  useEffect(() => {
    if (isSettingsOpen) setSettingsExpanded(true);
  }, [isSettingsOpen]);

  async function handleLogout() {
    try {
      await logout();
      toast.success('Çıkış yapıldı');
    } catch {
      toast.error('Çıkış yapılamadı');
    }
  }

  return (
    <aside className="w-64 h-screen max-h-screen bg-gray-900 text-white flex flex-col fixed left-0 top-0 z-40 overflow-hidden">
      {/* Logo */}
      <div className="p-6 border-b border-gray-700/50 shrink-0">
        <Link href="/admin/dashboard" className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-orange-500 flex items-center justify-center">
            <UtensilsCrossed size={20} />
          </div>
          <div>
            <p className="font-bold text-sm">Admin Panel</p>
            <p className="text-xs text-gray-400">Restoran Yönetimi</p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 min-h-0 p-4 space-y-1 overflow-y-auto overflow-x-hidden overscroll-contain">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== '/admin/dashboard' && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all',
                isActive
                  ? 'bg-orange-500/10 text-orange-400 font-medium'
                  : 'text-gray-400 hover:bg-gray-800 hover:text-white'
              )}
            >
              <item.icon size={18} />
              {item.label}
            </Link>
          );
        })}

        {/* Ayarlar (genişletilebilir) */}
        <div className="pt-2 mt-2 border-t border-gray-700/50">
          <button
            onClick={() => setSettingsExpanded((p) => !p)}
            className={cn(
              'w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl text-sm transition-all',
              isSettingsOpen
                ? 'bg-orange-500/10 text-orange-400 font-medium'
                : 'text-gray-400 hover:bg-gray-800 hover:text-white'
            )}
          >
            <div className="flex items-center gap-3">
              <Settings size={18} />
              Ayarlar
            </div>
            {settingsExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          </button>
          {settingsExpanded && (
            <div className="mt-1 ml-4 pl-2 border-l border-gray-700 space-y-0.5">
              {settingsItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    scroll={false}
                    className={cn(
                      'flex items-center gap-2 px-2.5 py-2 rounded-lg text-xs transition-all',
                      isActive ? 'text-orange-400 font-medium' : 'text-gray-500 hover:text-gray-300'
                    )}
                  >
                    <item.icon size={14} />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-gray-700/50 shrink-0">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-400 hover:bg-red-500/10 hover:text-red-400 transition-all"
        >
          <LogOut size={18} />
          Çıkış Yap
        </button>
      </div>
    </aside>
  );
}
