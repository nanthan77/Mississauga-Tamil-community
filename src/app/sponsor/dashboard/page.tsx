'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useSponsor, TIER_FEATURES, SponsorContent } from '@/contexts/SponsorContext';
import {
  LayoutDashboard, FileText, BarChart3, Settings, LogOut, Menu, X,
  Eye, MousePointer, Globe, Phone, Mail, TrendingUp, TrendingDown,
  Crown, Award, Medal, Plus, Clock, CheckCircle, XCircle, Megaphone,
  Image as ImageIcon, Video, ChevronRight, ExternalLink, AlertCircle
} from 'lucide-react';

export default function SponsorDashboard() {
  const router = useRouter();
  const {
    isSponsorAuthenticated,
    currentSponsor,
    sponsorLogout,
    getTierFeatures,
    getSponsorContents,
    canAccessFeature
  } = useSponsor();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [contents, setContents] = useState<SponsorContent[]>([]);

  useEffect(() => {
    if (!isSponsorAuthenticated || !currentSponsor) {
      router.push('/sponsor');
      return;
    }
    setContents(getSponsorContents(currentSponsor.id));
  }, [isSponsorAuthenticated, currentSponsor, router, getSponsorContents]);

  if (!currentSponsor) return null;

  const tierFeatures = getTierFeatures(currentSponsor.tier);
  const analytics = currentSponsor.analytics;

  const tierIcons = {
    platinum: <Crown className="w-5 h-5" />,
    gold: <Award className="w-5 h-5" />,
    silver: <Medal className="w-5 h-5" />,
    bronze: <Crown className="w-5 h-5" />,
  };

  const navItems = [
    { name: 'Dashboard', href: '/sponsor/dashboard', icon: LayoutDashboard, always: true },
    { name: 'My Content', href: '/sponsor/content', icon: FileText, feature: 'maxPromotions' as const },
    { name: 'Analytics', href: '/sponsor/analytics', icon: BarChart3, feature: 'analytics' as const },
    { name: 'Profile', href: '/sponsor/profile', icon: Settings, always: true },
  ];

  const pendingCount = contents.filter(c => c.status === 'pending').length;
  const approvedCount = contents.filter(c => c.status === 'approved').length;
  const rejectedCount = contents.filter(c => c.status === 'rejected').length;

  // Calculate ROI metrics
  const totalClicks = analytics.logoClicks + analytics.websiteClicks + analytics.phoneClicks + analytics.emailClicks;
  const engagementRate = analytics.totalPageViews > 0
    ? ((totalClicks / analytics.totalPageViews) * 100).toFixed(1)
    : '0';

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
        className={`fixed top-0 left-0 z-50 h-full w-64 bg-gradient-to-b from-slate-900 to-slate-800 transform transition-transform duration-300 lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
      >
        {/* Logo */}
        <div className="flex items-center justify-between h-16 px-4 bg-black/20">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-[#8B1538] rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">MTA</span>
            </div>
            <div>
              <span className="text-white font-bold text-sm">Sponsor Portal</span>
              <div className={`flex items-center gap-1 text-xs px-2 py-0.5 rounded ${tierFeatures.bgColor}`}>
                {tierIcons[currentSponsor.tier]}
                <span className="font-semibold">{tierFeatures.name}</span>
              </div>
            </div>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-white">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Sponsor Info */}
        <div className="px-4 py-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center">
              {currentSponsor.logo ? (
                <img src={currentSponsor.logo} alt={currentSponsor.name} className="w-full h-full object-contain rounded-xl" />
              ) : (
                <span className="text-white font-bold">{currentSponsor.name.charAt(0)}</span>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white font-medium text-sm truncate">{currentSponsor.name}</p>
              <p className="text-white/60 text-xs truncate">{currentSponsor.email}</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="mt-4 px-3">
          {navItems.map((item) => {
            const hasAccess = item.always || (item.feature && canAccessFeature(currentSponsor.tier, item.feature));
            if (!hasAccess && !item.always) return null;

            const isActive = typeof window !== 'undefined' && window.location.pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center px-4 py-2.5 mb-1 rounded-lg transition-all ${isActive
                    ? 'bg-white text-slate-900'
                    : 'text-white/80 hover:bg-white/10 hover:text-white'
                  }`}
              >
                <item.icon className="w-5 h-5 mr-3" />
                <span className="font-medium text-sm">{item.name}</span>
                {isActive && <ChevronRight className="w-4 h-4 ml-auto" />}
              </Link>
            );
          })}
        </nav>

        {/* Bottom Actions */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/10">
          <Link
            href={`/sponsors/${currentSponsor.id}`}
            className="flex items-center px-4 py-2.5 text-white/80 hover:bg-white/10 rounded-lg transition-colors mb-2"
          >
            <ExternalLink className="w-5 h-5 mr-3" />
            <span className="text-sm">View Public Page</span>
          </Link>
          <button
            onClick={() => {
              sponsorLogout();
              router.push('/sponsor');
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
            <h1 className="text-lg font-semibold text-gray-800">Dashboard</h1>
          </div>
          <div className={`px-3 py-1 rounded-full text-sm font-medium ${tierFeatures.bgColor}`}>
            {tierFeatures.name} Sponsor
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 lg:p-8">
          {/* Welcome Banner */}
          <div className="bg-gradient-to-r from-[#8B1538] to-[#6B1028] rounded-2xl p-6 mb-6 text-white">
            <h2 className="text-2xl font-bold mb-2">Welcome back, {currentSponsor.name}!</h2>
            <p className="text-white/80">
              Track your sponsorship performance and manage your content from this dashboard.
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <Eye className="w-5 h-5 text-blue-500" />
                <span className="text-xs text-green-500 flex items-center">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  12%
                </span>
              </div>
              <p className="text-2xl font-bold text-gray-900">{analytics.totalPageViews.toLocaleString()}</p>
              <p className="text-sm text-gray-500">Page Views</p>
            </div>

            <div className="bg-white rounded-xl p-4 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <MousePointer className="w-5 h-5 text-green-500" />
                <span className="text-xs text-green-500 flex items-center">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  8%
                </span>
              </div>
              <p className="text-2xl font-bold text-gray-900">{totalClicks.toLocaleString()}</p>
              <p className="text-sm text-gray-500">Total Clicks</p>
            </div>

            <div className="bg-white rounded-xl p-4 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <Globe className="w-5 h-5 text-purple-500" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{analytics.websiteClicks}</p>
              <p className="text-sm text-gray-500">Website Visits</p>
            </div>

            <div className="bg-white rounded-xl p-4 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <TrendingUp className="w-5 h-5 text-orange-500" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{engagementRate}%</p>
              <p className="text-sm text-gray-500">Engagement Rate</p>
            </div>
          </div>

          {/* Quick Actions & Content Overview */}
          <div className="grid lg:grid-cols-2 gap-6 mb-6">
            {/* Quick Actions */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="grid grid-cols-2 gap-3">
                {canAccessFeature(currentSponsor.tier, 'maxPromotions') && (
                  <Link
                    href="/sponsor/content/new"
                    className="flex flex-col items-center p-4 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors"
                  >
                    <Plus className="w-6 h-6 text-blue-600 mb-2" />
                    <span className="text-sm font-medium text-blue-900">New Promotion</span>
                  </Link>
                )}
                {canAccessFeature(currentSponsor.tier, 'maxGalleryImages') && (
                  <Link
                    href="/sponsor/profile"
                    className="flex flex-col items-center p-4 bg-purple-50 rounded-xl hover:bg-purple-100 transition-colors"
                  >
                    <ImageIcon className="w-6 h-6 text-purple-600 mb-2" />
                    <span className="text-sm font-medium text-purple-900">Add Images</span>
                  </Link>
                )}
                {canAccessFeature(currentSponsor.tier, 'analytics') && (
                  <Link
                    href="/sponsor/analytics"
                    className="flex flex-col items-center p-4 bg-green-50 rounded-xl hover:bg-green-100 transition-colors"
                  >
                    <BarChart3 className="w-6 h-6 text-green-600 mb-2" />
                    <span className="text-sm font-medium text-green-900">View Analytics</span>
                  </Link>
                )}
                <Link
                  href="/sponsor/profile"
                  className="flex flex-col items-center p-4 bg-orange-50 rounded-xl hover:bg-orange-100 transition-colors"
                >
                  <Settings className="w-6 h-6 text-orange-600 mb-2" />
                  <span className="text-sm font-medium text-orange-900">Edit Profile</span>
                </Link>
              </div>
            </div>

            {/* Content Status */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Content Status</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-yellow-600" />
                    <span className="text-sm font-medium text-yellow-900">Pending Review</span>
                  </div>
                  <span className="text-lg font-bold text-yellow-700">{pendingCount}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="text-sm font-medium text-green-900">Approved</span>
                  </div>
                  <span className="text-lg font-bold text-green-700">{approvedCount}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <XCircle className="w-5 h-5 text-red-600" />
                    <span className="text-sm font-medium text-red-900">Rejected</span>
                  </div>
                  <span className="text-lg font-bold text-red-700">{rejectedCount}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Click Breakdown */}
          <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Click Breakdown</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-gray-50 rounded-xl">
                <MousePointer className="w-6 h-6 text-gray-600 mx-auto mb-2" />
                <p className="text-xl font-bold text-gray-900">{analytics.logoClicks}</p>
                <p className="text-sm text-gray-500">Logo Clicks</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-xl">
                <Globe className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                <p className="text-xl font-bold text-gray-900">{analytics.websiteClicks}</p>
                <p className="text-sm text-gray-500">Website</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-xl">
                <Phone className="w-6 h-6 text-green-600 mx-auto mb-2" />
                <p className="text-xl font-bold text-gray-900">{analytics.phoneClicks}</p>
                <p className="text-sm text-gray-500">Phone</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-xl">
                <Mail className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                <p className="text-xl font-bold text-gray-900">{analytics.emailClicks}</p>
                <p className="text-sm text-gray-500">Email</p>
              </div>
            </div>
          </div>

          {/* Tier Features */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Your {tierFeatures.name} Benefits</h3>
            <div className="grid md:grid-cols-3 gap-4">
              {Object.entries(tierFeatures.features).map(([key, value]) => {
                const isEnabled = value === true || (typeof value === 'number' && value !== 0) || (typeof value === 'string' && value !== 'none');
                return (
                  <div
                    key={key}
                    className={`p-3 rounded-lg flex items-center gap-3 ${isEnabled ? 'bg-green-50' : 'bg-gray-50'
                      }`}
                  >
                    {isEnabled ? (
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    ) : (
                      <XCircle className="w-5 h-5 text-gray-400 flex-shrink-0" />
                    )}
                    <div>
                      <p className={`text-sm font-medium ${isEnabled ? 'text-green-900' : 'text-gray-500'}`}>
                        {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                      </p>
                      {typeof value === 'number' && value !== 0 && value !== -1 && (
                        <p className="text-xs text-gray-500">Up to {value}</p>
                      )}
                      {value === -1 && (
                        <p className="text-xs text-green-600">Unlimited</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {currentSponsor.tier !== 'platinum' && (
              <div className="mt-4 p-4 bg-gradient-to-r from-[#8B1538]/10 to-[#6B1028]/10 rounded-xl">
                <div className="flex items-center gap-2 mb-2">
                  <AlertCircle className="w-5 h-5 text-[#8B1538]" />
                  <span className="font-medium text-[#8B1538]">Upgrade to unlock more features</span>
                </div>
                <p className="text-sm text-gray-600">
                  Contact us to upgrade your sponsorship tier and access premium features like full analytics, video content, and more.
                </p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
