'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useSponsor, TIER_FEATURES } from '@/contexts/SponsorContext';
import {
  ArrowLeft, Eye, MousePointer, Globe, Phone, Mail, TrendingUp,
  TrendingDown, BarChart3, PieChart, Calendar, Users, ExternalLink,
  AlertCircle, Crown, Lock
} from 'lucide-react';

export default function SponsorAnalyticsPage() {
  const router = useRouter();
  const { isSponsorAuthenticated, currentSponsor, getTierFeatures, canAccessFeature } = useSponsor();

  useEffect(() => {
    if (!isSponsorAuthenticated || !currentSponsor) {
      router.push('/sponsor');
    }
  }, [isSponsorAuthenticated, currentSponsor, router]);

  if (!currentSponsor) return null;

  const tierFeatures = getTierFeatures(currentSponsor.tier);
  const analytics = currentSponsor.analytics;
  const analyticsLevel = tierFeatures.features.analytics;

  // Check if user can access analytics
  if (analyticsLevel === 'none') {
    return (
      <div className="min-h-screen bg-gray-100">
        <header className="bg-white shadow-sm">
          <div className="max-w-6xl mx-auto px-4 py-4 flex items-center gap-4">
            <Link href="/sponsor/dashboard" className="p-2 hover:bg-gray-100 rounded-lg">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-xl font-bold text-gray-900">Analytics</h1>
          </div>
        </header>
        <main className="max-w-6xl mx-auto px-4 py-12">
          <div className="bg-white rounded-2xl p-12 text-center shadow-sm">
            <Lock className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Analytics Locked</h2>
            <p className="text-gray-600 mb-6">
              Upgrade your sponsorship tier to access analytics and track your ROI.
            </p>
            <Link
              href="/#contact"
              className="inline-flex items-center px-6 py-3 bg-[#8B1538] text-white rounded-lg font-medium hover:bg-[#6B1028] transition-colors"
            >
              <Crown className="w-5 h-5 mr-2" />
              Upgrade Sponsorship
            </Link>
          </div>
        </main>
      </div>
    );
  }

  // Calculate metrics
  const totalClicks = analytics.logoClicks + analytics.websiteClicks + analytics.phoneClicks + analytics.emailClicks;
  const engagementRate = analytics.totalPageViews > 0
    ? ((totalClicks / analytics.totalPageViews) * 100).toFixed(1)
    : '0';

  // Mock data for charts (in production, use real historical data)
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    return {
      date: date.toLocaleDateString('en-US', { weekday: 'short' }),
      views: Math.floor(Math.random() * 50) + 10,
      clicks: Math.floor(Math.random() * 10) + 1,
    };
  });

  const clickBreakdown = [
    { label: 'Logo', value: analytics.logoClicks, color: 'bg-blue-500' },
    { label: 'Website', value: analytics.websiteClicks, color: 'bg-green-500' },
    { label: 'Phone', value: analytics.phoneClicks, color: 'bg-purple-500' },
    { label: 'Email', value: analytics.emailClicks, color: 'bg-orange-500' },
  ];

  const totalClicksForChart = clickBreakdown.reduce((sum, item) => sum + item.value, 0) || 1;

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/sponsor/dashboard" className="p-2 hover:bg-gray-100 rounded-lg">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Analytics Dashboard</h1>
              <p className="text-sm text-gray-500">Track your sponsorship performance and ROI</p>
            </div>
          </div>
          <div className={`px-3 py-1 rounded-full text-sm font-medium ${tierFeatures.bgColor}`}>
            {analyticsLevel === 'full' ? 'Full' : analyticsLevel === 'basic' ? 'Basic' : 'Views Only'} Analytics
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Key Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="p-3 bg-blue-100 rounded-xl">
                <Eye className="w-6 h-6 text-blue-600" />
              </div>
              <span className="text-xs text-green-500 flex items-center bg-green-50 px-2 py-1 rounded-full">
                <TrendingUp className="w-3 h-3 mr-1" />
                +12%
              </span>
            </div>
            <p className="text-3xl font-bold text-gray-900">{analytics.totalPageViews.toLocaleString()}</p>
            <p className="text-sm text-gray-500">Total Page Views</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="p-3 bg-green-100 rounded-xl">
                <MousePointer className="w-6 h-6 text-green-600" />
              </div>
              <span className="text-xs text-green-500 flex items-center bg-green-50 px-2 py-1 rounded-full">
                <TrendingUp className="w-3 h-3 mr-1" />
                +8%
              </span>
            </div>
            <p className="text-3xl font-bold text-gray-900">{totalClicks.toLocaleString()}</p>
            <p className="text-sm text-gray-500">Total Clicks</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="p-3 bg-purple-100 rounded-xl">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900">{analytics.uniqueVisitors.toLocaleString()}</p>
            <p className="text-sm text-gray-500">Unique Visitors</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="p-3 bg-orange-100 rounded-xl">
                <TrendingUp className="w-6 h-6 text-orange-600" />
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900">{engagementRate}%</p>
            <p className="text-sm text-gray-500">Engagement Rate</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          {/* Views Chart */}
          <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Views & Clicks (Last 7 Days)</h3>
              <div className="flex items-center gap-4 text-sm">
                <span className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-blue-500 rounded-full" />
                  Views
                </span>
                <span className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-green-500 rounded-full" />
                  Clicks
                </span>
              </div>
            </div>
            <div className="h-64 flex items-end justify-between gap-2">
              {last7Days.map((day, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <div className="w-full flex flex-col items-center gap-1" style={{ height: '200px' }}>
                    <div
                      className="w-full bg-blue-500 rounded-t"
                      style={{ height: `${(day.views / 60) * 100}%`, minHeight: '4px' }}
                    />
                    <div
                      className="w-full bg-green-500 rounded-t"
                      style={{ height: `${(day.clicks / 60) * 100}%`, minHeight: '4px' }}
                    />
                  </div>
                  <span className="text-xs text-gray-500">{day.date}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Click Breakdown */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Click Breakdown</h3>
            <div className="space-y-4">
              {clickBreakdown.map((item) => (
                <div key={item.label}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-gray-600">{item.label}</span>
                    <span className="text-sm font-medium text-gray-900">{item.value}</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${item.color} rounded-full transition-all`}
                      style={{ width: `${(item.value / totalClicksForChart) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-6 border-t">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-900">Total Clicks</span>
                <span className="text-xl font-bold text-gray-900">{totalClicks}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Analytics (for higher tiers) */}
        {(analyticsLevel === 'full' || analyticsLevel === 'basic') && (
          <div className="grid lg:grid-cols-2 gap-6 mb-8">
            {/* Referral Sources */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Traffic Sources</h3>
              <div className="space-y-3">
                {[
                  { source: 'Direct', count: 45, percentage: 45 },
                  { source: 'MTA Website', count: 30, percentage: 30 },
                  { source: 'Google Search', count: 15, percentage: 15 },
                  { source: 'Social Media', count: 10, percentage: 10 },
                ].map((item) => (
                  <div key={item.source} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                        <Globe className="w-4 h-4 text-gray-600" />
                      </div>
                      <span className="text-sm text-gray-700">{item.source}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-20 h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#8B1538] rounded-full"
                          style={{ width: `${item.percentage}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium text-gray-900 w-8">{item.percentage}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Performance Summary */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Summary</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-green-50 rounded-xl">
                  <div>
                    <p className="text-sm text-gray-600">Website Click Rate</p>
                    <p className="text-xl font-bold text-green-700">
                      {analytics.totalPageViews > 0
                        ? ((analytics.websiteClicks / analytics.totalPageViews) * 100).toFixed(2)
                        : '0'}%
                    </p>
                  </div>
                  <ExternalLink className="w-8 h-8 text-green-500" />
                </div>

                <div className="flex items-center justify-between p-4 bg-blue-50 rounded-xl">
                  <div>
                    <p className="text-sm text-gray-600">Contact Rate</p>
                    <p className="text-xl font-bold text-blue-700">
                      {analytics.totalPageViews > 0
                        ? (((analytics.phoneClicks + analytics.emailClicks) / analytics.totalPageViews) * 100).toFixed(2)
                        : '0'}%
                    </p>
                  </div>
                  <Phone className="w-8 h-8 text-blue-500" />
                </div>

                <div className="flex items-center justify-between p-4 bg-purple-50 rounded-xl">
                  <div>
                    <p className="text-sm text-gray-600">Logo Visibility</p>
                    <p className="text-xl font-bold text-purple-700">
                      {analytics.totalPageViews > 0
                        ? ((analytics.logoClicks / analytics.totalPageViews) * 100).toFixed(2)
                        : '0'}%
                    </p>
                  </div>
                  <MousePointer className="w-8 h-8 text-purple-500" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Full Analytics Only */}
        {analyticsLevel === 'full' && (
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">ROI Insights</h3>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-xl">
                <p className="text-4xl font-bold text-green-700 mb-2">
                  {((totalClicks / (analytics.totalPageViews || 1)) * 100).toFixed(1)}%
                </p>
                <p className="text-sm text-green-600">Conversion Rate</p>
                <p className="text-xs text-gray-500 mt-1">Clicks per page view</p>
              </div>
              <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
                <p className="text-4xl font-bold text-blue-700 mb-2">
                  ${((analytics.websiteClicks * 0.50) + (analytics.phoneClicks * 2)).toFixed(0)}
                </p>
                <p className="text-sm text-blue-600">Est. Lead Value</p>
                <p className="text-xs text-gray-500 mt-1">Based on industry avg</p>
              </div>
              <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl">
                <p className="text-4xl font-bold text-purple-700 mb-2">
                  {analytics.uniqueVisitors > 0
                    ? (analytics.totalPageViews / analytics.uniqueVisitors).toFixed(1)
                    : '0'}
                </p>
                <p className="text-sm text-purple-600">Pages per Visitor</p>
                <p className="text-xs text-gray-500 mt-1">Engagement metric</p>
              </div>
            </div>
          </div>
        )}

        {/* Upgrade Notice for Basic/Views-Only */}
        {analyticsLevel !== 'full' && (
          <div className="mt-8 p-6 bg-gradient-to-r from-[#8B1538]/10 to-[#6B1028]/10 rounded-xl">
            <div className="flex items-center gap-3 mb-3">
              <AlertCircle className="w-6 h-6 text-[#8B1538]" />
              <h3 className="text-lg font-semibold text-[#8B1538]">Unlock Full Analytics</h3>
            </div>
            <p className="text-gray-600 mb-4">
              Upgrade to Platinum tier to access comprehensive ROI insights, demographic data, comparison reports, and more.
            </p>
            <Link
              href="/#contact"
              className="inline-flex items-center px-4 py-2 bg-[#8B1538] text-white rounded-lg font-medium hover:bg-[#6B1028] transition-colors"
            >
              <Crown className="w-4 h-4 mr-2" />
              Contact to Upgrade
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}
