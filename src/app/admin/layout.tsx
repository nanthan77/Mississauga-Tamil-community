'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { AdminProvider, useAdmin } from '@/contexts/AdminContext';
import { SponsorProvider } from '@/contexts/SponsorContext';
import {
  LayoutDashboard,
  Users,
  Calendar,
  Settings,
  Image,
  FileText,
  CreditCard,
  LogOut,
  Menu,
  X,
  ChevronRight,
  Home,
  UserCog,
  Shield,
  Activity,
  UserCircle,
  Building2,
  UserPlus,
  DollarSign,
  Bell
} from 'lucide-react';

const navItems = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Sponsors', href: '/admin/sponsors', icon: CreditCard },
  { name: 'Events', href: '/admin/events', icon: Calendar },
  { name: 'Membership Tiers', href: '/admin/membership', icon: Users },
  { name: 'Gallery', href: '/admin/gallery', icon: Image },
  { name: 'About & Leadership', href: '/admin/about', icon: FileText },
  { name: 'Site Settings', href: '/admin/settings', icon: Settings },
];

const crmItems = [
  { name: 'Members CRM', href: '/admin/members', icon: UserPlus },
  { name: 'Payments', href: '/admin/payments', icon: DollarSign },
  { name: 'Notifications', href: '/admin/notifications', icon: Bell },
];

const adminOnlyItems = [
  { name: 'User Management', href: '/admin/users', icon: UserCog },
  { name: 'Sponsor Approvals', href: '/admin/sponsor-approvals', icon: Building2 },
  { name: 'Activity Logs', href: '/admin/activity', icon: Activity },
];

function AdminLayoutContent({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, currentUser, logout, isAdmin } = useAdmin();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated && pathname !== '/admin') {
      router.push('/admin');
    }
  }, [isAuthenticated, pathname, router]);

  if (!isAuthenticated) {
    return <>{children}</>;
  }

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-500';
      case 'editor': return 'bg-blue-500';
      case 'viewer': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-64 bg-gradient-to-b from-[#8B1538] to-[#6B1028] transform transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Logo */}
        <div className="flex items-center justify-between h-16 px-4 bg-[#6B1028]/50">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg">
              <span className="text-[#8B1538] font-bold text-sm">MTA</span>
            </div>
            <div>
              <span className="text-white font-bold text-sm">Admin Panel</span>
              <div className="flex items-center gap-1">
                <span className={`text-[10px] px-1.5 py-0.5 rounded ${getRoleBadgeColor(currentUser?.role || '')}`}>
                  {currentUser?.role?.toUpperCase()}
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-white"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Current User */}
        <div className="px-4 py-3 border-b border-white/10">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <span className="text-white font-semibold text-sm">
                {currentUser?.name?.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white font-medium text-sm truncate">{currentUser?.name}</p>
              <p className="text-white/60 text-xs truncate">{currentUser?.email}</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="mt-4 px-3 flex-1 overflow-y-auto">
          <p className="px-4 text-xs font-semibold text-white/50 uppercase tracking-wider mb-2">
            Content
          </p>
          {navItems.map((item) => {
            const isActive = pathname === item.href ||
              (item.href !== '/admin' && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center px-4 py-2.5 mb-1 rounded-lg transition-all ${
                  isActive
                    ? 'bg-white text-[#8B1538] shadow-lg'
                    : 'text-white/80 hover:bg-white/10 hover:text-white'
                }`}
              >
                <item.icon className="w-5 h-5 mr-3" />
                <span className="font-medium text-sm">{item.name}</span>
                {isActive && <ChevronRight className="w-4 h-4 ml-auto" />}
              </Link>
            );
          })}

          {/* CRM Section */}
          <p className="px-4 text-xs font-semibold text-white/50 uppercase tracking-wider mt-6 mb-2">
            Member Management
          </p>
          {crmItems.map((item) => {
            const isActive = pathname === item.href ||
              (item.href !== '/admin' && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center px-4 py-2.5 mb-1 rounded-lg transition-all ${
                  isActive
                    ? 'bg-white text-[#8B1538] shadow-lg'
                    : 'text-white/80 hover:bg-white/10 hover:text-white'
                }`}
              >
                <item.icon className="w-5 h-5 mr-3" />
                <span className="font-medium text-sm">{item.name}</span>
                {isActive && <ChevronRight className="w-4 h-4 ml-auto" />}
              </Link>
            );
          })}

          {/* Admin Only Section */}
          {isAdmin() && (
            <>
              <p className="px-4 text-xs font-semibold text-white/50 uppercase tracking-wider mt-6 mb-2">
                Administration
              </p>
              {adminOnlyItems.map((item) => {
                const isActive = pathname === item.href ||
                  (item.href !== '/admin' && pathname.startsWith(item.href));
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center px-4 py-2.5 mb-1 rounded-lg transition-all ${
                      isActive
                        ? 'bg-white text-[#8B1538] shadow-lg'
                        : 'text-white/80 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <item.icon className="w-5 h-5 mr-3" />
                    <span className="font-medium text-sm">{item.name}</span>
                    {isActive && <ChevronRight className="w-4 h-4 ml-auto" />}
                  </Link>
                );
              })}
            </>
          )}
        </nav>

        {/* Bottom Actions */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/20 bg-[#6B1028]/30">
          <Link
            href="/admin/profile"
            onClick={() => setSidebarOpen(false)}
            className="flex items-center px-4 py-2.5 text-white/80 hover:bg-white/10 rounded-lg transition-colors mb-2"
          >
            <UserCircle className="w-5 h-5 mr-3" />
            <span className="text-sm">My Profile</span>
          </Link>
          <Link
            href="/"
            className="flex items-center px-4 py-2.5 text-white/80 hover:bg-white/10 rounded-lg transition-colors mb-2"
          >
            <Home className="w-5 h-5 mr-3" />
            <span className="text-sm">View Website</span>
          </Link>
          <button
            onClick={() => {
              logout();
              router.push('/admin');
            }}
            className="flex items-center w-full px-4 py-2.5 text-white/80 hover:bg-white/10 rounded-lg transition-colors"
          >
            <LogOut className="w-5 h-5 mr-3" />
            <span className="text-sm">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="lg:ml-64">
        {/* Top Header */}
        <header className="bg-white shadow-sm h-16 flex items-center justify-between px-4 lg:px-8 sticky top-0 z-30">
          <div className="flex items-center">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-md hover:bg-gray-100 mr-2"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div>
              <h1 className="text-lg font-semibold text-gray-800">
                {[...navItems, ...crmItems, ...adminOnlyItems].find(item =>
                  pathname === item.href ||
                  (item.href !== '/admin' && pathname.startsWith(item.href))
                )?.name || 'Dashboard'}
              </h1>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="hidden sm:flex items-center space-x-2 text-sm text-gray-600">
              <Shield className="w-4 h-4" />
              <span>Logged in as <strong>{currentUser?.name}</strong></span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminProvider>
      <SponsorProvider>
        <AdminLayoutContent>{children}</AdminLayoutContent>
      </SponsorProvider>
    </AdminProvider>
  );
}
