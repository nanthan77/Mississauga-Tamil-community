'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSponsor, TIER_FEATURES } from '@/contexts/SponsorContext';
import {
  Building2, Lock, User, Eye, EyeOff, AlertCircle, ArrowRight,
  BarChart3, FileText, Megaphone, Crown, Award, Medal, Star
} from 'lucide-react';
import Link from 'next/link';

export default function SponsorPortalPage() {
  const router = useRouter();
  const { isSponsorAuthenticated, currentSponsor, sponsorLogin } = useSponsor();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // If already logged in, redirect to dashboard
  if (isSponsorAuthenticated && currentSponsor) {
    router.push('/sponsor/dashboard');
    return null;
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));

    const success = sponsorLogin(username, password);
    if (success) {
      router.push('/sponsor/dashboard');
    } else {
      setError('Invalid credentials or account not active');
      setPassword('');
    }
    setIsLoading(false);
  };

  const tierIcons = {
    platinum: <Crown className="w-5 h-5" />,
    gold: <Award className="w-5 h-5" />,
    silver: <Medal className="w-5 h-5" />,
    bronze: <Star className="w-5 h-5" />,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-[#1a1a2e] to-slate-900">
      {/* Header */}
      <header className="bg-black/30 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-[#8B1538] rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">MTA</span>
            </div>
            <span className="text-white font-semibold">Mississauga Tamils</span>
          </Link>
          <div className="flex items-center gap-2 text-white/60">
            <Building2 className="w-5 h-5" />
            <span className="font-medium">Sponsor Portal</span>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left - Info Section */}
          <div className="text-white">
            <h1 className="text-4xl font-bold mb-4">
              Sponsor Portal
            </h1>
            <p className="text-white/70 text-lg mb-8">
              Manage your sponsorship, track performance, and connect with the Tamil community in Mississauga.
            </p>

            {/* Features by Tier */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white/90 mb-4">Tier Benefits</h3>

              {(['platinum', 'gold', 'silver'] as const).map((tier) => {
                const config = TIER_FEATURES[tier];
                return (
                  <div
                    key={tier}
                    className={`p-4 rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm`}
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <div className={`p-2 rounded-lg ${config.bgColor}`}>
                        {tierIcons[tier]}
                      </div>
                      <h4 className="font-semibold text-lg">{config.name}</h4>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm text-white/70">
                      {config.features.customPage && (
                        <div className="flex items-center gap-1">
                          <FileText className="w-3 h-3" /> Custom Page
                        </div>
                      )}
                      {config.features.analytics !== 'none' && (
                        <div className="flex items-center gap-1">
                          <BarChart3 className="w-3 h-3" />
                          {config.features.analytics === 'full' ? 'Full' : config.features.analytics === 'basic' ? 'Basic' : 'View'} Analytics
                        </div>
                      )}
                      {config.features.maxPromotions !== 0 && (
                        <div className="flex items-center gap-1">
                          <Megaphone className="w-3 h-3" />
                          {config.features.maxPromotions === -1 ? 'Unlimited' : config.features.maxPromotions} Promotions
                        </div>
                      )}
                      {config.features.videoAllowed && (
                        <div className="flex items-center gap-1">
                          <FileText className="w-3 h-3" /> Video Content
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Demo Credentials */}
            <div className="mt-8 p-4 rounded-xl bg-blue-500/10 border border-blue-500/30">
              <h4 className="font-semibold text-blue-300 mb-2">Demo Credentials</h4>
              <div className="text-sm text-white/70 space-y-1">
                <p><strong>Platinum:</strong> rbc / rbc2026</p>
                <p><strong>Gold:</strong> td / td2026</p>
                <p><strong>Silver:</strong> sunlife / sunlife2026</p>
              </div>
            </div>
          </div>

          {/* Right - Login Form */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-[#8B1538] to-[#6B1028] rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Building2 className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Welcome Back</h2>
              <p className="text-gray-600">Sign in to your sponsor portal</p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3 text-red-700">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Username
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#8B1538] focus:border-transparent outline-none bg-white text-gray-900 transition-all"
                    placeholder="Enter your username"
                    required
                    autoComplete="username"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-12 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#8B1538] focus:border-transparent outline-none bg-white text-gray-900 transition-all"
                    placeholder="Enter your password"
                    required
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-gradient-to-r from-[#8B1538] to-[#6B1028] text-white rounded-xl font-semibold hover:opacity-90 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    Sign In
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Want to become a sponsor?{' '}
                <Link href="/#contact" className="text-[#8B1538] hover:underline font-medium">
                  Contact us
                </Link>
              </p>
            </div>

            <div className="mt-6 pt-6 border-t">
              <Link
                href="/"
                className="block text-center text-gray-600 hover:text-gray-900 transition-colors"
              >
                Back to Main Website
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
