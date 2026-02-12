'use client';

import { useState } from 'react';
import { useAdmin } from '@/contexts/AdminContext';
import {
  Lock,
  Users,
  Calendar,
  CreditCard,
  Image,
  Eye,
  Activity,
  TrendingUp,
  Clock,
  Shield,
  UserCheck,
  User
} from 'lucide-react';
import Link from 'next/link';

export default function AdminPage() {
  const {
    isAuthenticated,
    login,
    currentUser,
    sponsors,
    events,
    galleryImages,
    membershipTiers,
    activityLogs,
    users,
    canEdit,
    isAdmin
  } = useAdmin();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const success = login(username, password);
    if (!success) {
      setError('Invalid username or password');
      setPassword('');
    }
  };

  // Login Page
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#8B1538] via-[#6B1028] to-[#4A0B1B] flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-[#8B1538] to-[#B94E48] rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Lock className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Admin Login</h1>
            <p className="text-gray-600 mt-2">Mississauga Tamils Association</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                Username
              </label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  setError('');
                }}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B1538] focus:border-transparent outline-none bg-white text-gray-900 font-sans placeholder:text-gray-400"
                placeholder="Enter your username"
                required
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError('');
                }}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B1538] focus:border-transparent outline-none bg-white text-gray-900 font-sans placeholder:text-gray-400"
                placeholder="Enter your password"
                required
              />
              {error && (
                <p className="text-red-500 text-sm mt-2">{error}</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-[#8B1538] to-[#6B1028] text-white py-3 rounded-lg font-semibold hover:from-[#6B1028] hover:to-[#4A0B1B] transition-all shadow-lg"
            >
              Sign In
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link href="/" className="text-[#8B1538] hover:underline text-sm">
              Back to Website
            </Link>
          </div>

          <div className="mt-6 p-4 bg-amber-50 rounded-lg border border-amber-200">
            <p className="text-sm text-amber-800">
              <strong>Demo Credentials:</strong><br />
              Username: <code className="bg-amber-100 px-1 rounded">admin</code><br />
              Password: <code className="bg-amber-100 px-1 rounded">mta2026</code>
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Dashboard
  const stats = [
    {
      name: 'Active Sponsors',
      value: sponsors.filter(s => s.isActive).length,
      total: sponsors.length,
      icon: CreditCard,
      href: '/admin/sponsors',
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      name: 'Events',
      value: events.filter(e => e.isActive).length,
      total: events.length,
      icon: Calendar,
      href: '/admin/events',
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
    },
    {
      name: 'Membership Tiers',
      value: membershipTiers.filter(t => t.isActive).length,
      total: membershipTiers.length,
      icon: Users,
      href: '/admin/membership',
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      name: 'Gallery Images',
      value: galleryImages.filter(i => i.isActive).length,
      total: galleryImages.length,
      icon: Image,
      href: '/admin/gallery',
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-50',
    },
  ];

  const quickActions = [
    { name: 'Add New Sponsor', href: '/admin/sponsors', action: 'add' },
    { name: 'Create Event', href: '/admin/events', action: 'add' },
    { name: 'Upload Gallery Image', href: '/admin/gallery', action: 'add' },
    { name: 'Update Site Settings', href: '/admin/settings', action: 'edit' },
  ];

  const getRelativeTime = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  const getActionColor = (action: string) => {
    if (action.includes('Delete')) return 'text-red-600 bg-red-50';
    if (action.includes('Add') || action.includes('Login')) return 'text-green-600 bg-green-50';
    if (action.includes('Update')) return 'text-blue-600 bg-blue-50';
    return 'text-gray-600 bg-gray-50';
  };

  const recentLogs = activityLogs.slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-[#8B1538] via-[#6B1028] to-[#4A0B1B] rounded-2xl p-6 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full -ml-24 -mb-24" />
        <div className="relative">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-white/60">Welcome back,</span>
            <span className={`text-xs px-2 py-0.5 rounded-full ${
              currentUser?.role === 'admin' ? 'bg-red-500/80' :
              currentUser?.role === 'editor' ? 'bg-blue-500/80' : 'bg-gray-500/80'
            }`}>
              {currentUser?.role?.toUpperCase()}
            </span>
          </div>
          <h2 className="text-2xl font-bold mb-2">{currentUser?.name}</h2>
          <p className="text-white/70 mb-4">
            {canEdit()
              ? 'You have full access to manage website content.'
              : 'You have view-only access to the admin panel.'}
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/"
              target="_blank"
              className="inline-flex items-center px-4 py-2 bg-white text-[#8B1538] rounded-lg font-semibold hover:bg-gray-100 transition-colors text-sm"
            >
              <Eye className="w-4 h-4 mr-2" />
              View Live Website
            </Link>
            {isAdmin() && (
              <Link
                href="/admin/users"
                className="inline-flex items-center px-4 py-2 bg-white/20 text-white rounded-lg font-semibold hover:bg-white/30 transition-colors text-sm"
              >
                <UserCheck className="w-4 h-4 mr-2" />
                Manage Users
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Link
            key={stat.name}
            href={stat.href}
            className="bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition-all group"
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <div className="text-right">
                <span className="text-3xl font-bold text-gray-900">{stat.value}</span>
                {stat.total > stat.value && (
                  <p className="text-xs text-gray-400">of {stat.total}</p>
                )}
              </div>
            </div>
            <h3 className="font-medium text-gray-600 group-hover:text-gray-900 transition-colors">{stat.name}</h3>
          </Link>
        ))}
      </div>

      {/* Admin Stats (only for admins) */}
      {isAdmin() && (
        <div className="grid sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                <User className="w-5 h-5 text-indigo-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{users.length}</p>
                <p className="text-sm text-gray-500">Admin Users</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                <Activity className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{activityLogs.length}</p>
                <p className="text-sm text-gray-500">Activities Logged</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{users.filter(u => u.role === 'admin').length}</p>
                <p className="text-sm text-gray-500">Administrators</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quick Actions (only for editors and admins) */}
      {canEdit() && (
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <TrendingUp className="w-5 h-5 mr-2 text-[#8B1538]" />
            Quick Actions
          </h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {quickActions.map((action) => (
              <Link
                key={action.name}
                href={action.href}
                className="flex items-center justify-center px-4 py-3 border-2 border-dashed border-gray-200 rounded-xl text-gray-600 hover:border-[#8B1538] hover:text-[#8B1538] hover:bg-red-50/50 transition-all"
              >
                <span className="text-xl mr-2 font-light">+</span>
                {action.name}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Recent Activity & Tips */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <Clock className="w-5 h-5 mr-2 text-[#8B1538]" />
              Recent Activity
            </h3>
            {isAdmin() && (
              <Link
                href="/admin/activity"
                className="text-sm text-[#8B1538] hover:underline"
              >
                View All
              </Link>
            )}
          </div>
          {recentLogs.length > 0 ? (
            <div className="space-y-3">
              {recentLogs.map((log) => (
                <div key={log.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="w-8 h-8 bg-gradient-to-br from-[#8B1538] to-[#B94E48] rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-xs font-semibold">
                      {log.userName.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-medium text-gray-900 text-sm">{log.userName}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${getActionColor(log.action)}`}>
                        {log.action}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 truncate">{log.details}</p>
                    <p className="text-xs text-gray-400 mt-1">{getRelativeTime(log.timestamp)}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-400">
              <Activity className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>No recent activity</p>
            </div>
          )}
        </div>

        {/* Tips */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Getting Started</h3>
          <ul className="space-y-3">
            <li className="flex items-start">
              <span className="w-6 h-6 bg-gradient-to-br from-green-400 to-green-500 text-white rounded-full flex items-center justify-center text-xs font-bold mr-3 mt-0.5 shadow-sm">1</span>
              <div>
                <p className="font-medium text-gray-800">Update Site Settings</p>
                <p className="text-sm text-gray-500">Add your logo, contact info, and social links</p>
              </div>
            </li>
            <li className="flex items-start">
              <span className="w-6 h-6 bg-gradient-to-br from-green-400 to-green-500 text-white rounded-full flex items-center justify-center text-xs font-bold mr-3 mt-0.5 shadow-sm">2</span>
              <div>
                <p className="font-medium text-gray-800">Add Your Sponsors</p>
                <p className="text-sm text-gray-500">Upload sponsor logos and set their tier</p>
              </div>
            </li>
            <li className="flex items-start">
              <span className="w-6 h-6 bg-gradient-to-br from-green-400 to-green-500 text-white rounded-full flex items-center justify-center text-xs font-bold mr-3 mt-0.5 shadow-sm">3</span>
              <div>
                <p className="font-medium text-gray-800">Create Events</p>
                <p className="text-sm text-gray-500">Add upcoming events with all details in both languages</p>
              </div>
            </li>
            <li className="flex items-start">
              <span className="w-6 h-6 bg-gradient-to-br from-green-400 to-green-500 text-white rounded-full flex items-center justify-center text-xs font-bold mr-3 mt-0.5 shadow-sm">4</span>
              <div>
                <p className="font-medium text-gray-800">Upload Gallery Images</p>
                <p className="text-sm text-gray-500">Showcase your past event photos</p>
              </div>
            </li>
          </ul>

          <div className="mt-6 space-y-2">
            <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
              <p className="text-sm text-blue-800">
                <strong>Bilingual Content:</strong> Fill in both English and Tamil fields.
              </p>
            </div>
            {!canEdit() && (
              <div className="p-3 bg-amber-50 rounded-lg border border-amber-100">
                <p className="text-sm text-amber-800">
                  <strong>View Only:</strong> Contact an admin to get edit permissions.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
