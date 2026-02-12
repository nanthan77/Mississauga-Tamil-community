'use client';

import { useState, useMemo } from 'react';
import { useAdmin, MembershipTier } from '@/contexts/AdminContext';
import { Edit2, Save, X, DollarSign, Star, Download, BarChart3, Eye, EyeOff, AlertCircle } from 'lucide-react';

export default function MembershipPage() {
  const { membershipTiers, updateMembershipTier, canEdit, logActivity } = useAdmin();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<Partial<MembershipTier>>({});

  // Stats
  const stats = useMemo(() => ({
    total: membershipTiers.length,
    active: membershipTiers.filter(t => t.isActive).length,
    inactive: membershipTiers.filter(t => !t.isActive).length,
    popular: membershipTiers.filter(t => t.isPopular).length,
    avgPrice: membershipTiers.length > 0
      ? Math.round(membershipTiers.reduce((sum, t) => sum + t.price, 0) / membershipTiers.length)
      : 0,
  }), [membershipTiers]);

  const startEdit = (tier: MembershipTier) => {
    if (!canEdit()) return;
    setEditingId(tier.id);
    setEditData({ ...tier });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditData({});
  };

  const saveEdit = () => {
    if (editingId && editData) {
      updateMembershipTier(editingId, editData);
      logActivity('Update Membership', `Updated membership tier: ${editData.name}`);
      setEditingId(null);
      setEditData({});
    }
  };

  const toggleActive = (tier: MembershipTier) => {
    if (!canEdit()) return;
    updateMembershipTier(tier.id, { isActive: !tier.isActive });
    logActivity('Update Membership', `${tier.isActive ? 'Deactivated' : 'Activated'} membership tier: ${tier.name}`);
  };

  const togglePopular = (tier: MembershipTier) => {
    if (!canEdit()) return;
    // Only one tier can be popular at a time
    membershipTiers.forEach(t => {
      if (t.id !== tier.id && t.isPopular) {
        updateMembershipTier(t.id, { isPopular: false });
      }
    });
    updateMembershipTier(tier.id, { isPopular: !tier.isPopular });
    logActivity('Update Membership', `${tier.isPopular ? 'Removed popular badge from' : 'Set as popular'}: ${tier.name}`);
  };

  const exportMembership = () => {
    const data = membershipTiers.map(tier => ({
      name: tier.name,
      nameTamil: tier.nameTamil,
      price: tier.price,
      features: tier.features.join('; '),
      featuresTamil: tier.featuresTamil.join('; '),
      isPopular: tier.isPopular ? 'Yes' : 'No',
      status: tier.isActive ? 'Active' : 'Inactive',
    }));

    const csv = [
      ['Name', 'Name (Tamil)', 'Price ($)', 'Features', 'Features (Tamil)', 'Popular', 'Status'],
      ...data.map(row => [row.name, row.nameTamil, row.price.toString(), row.features, row.featuresTamil, row.isPopular, row.status])
    ].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'membership-tiers-export.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Membership Tiers</h2>
          <p className="text-gray-600">Manage your membership plans and pricing</p>
        </div>
        <button
          onClick={exportMembership}
          className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
        >
          <Download className="w-4 h-4 mr-2" />
          Export
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <BarChart3 className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              <p className="text-sm text-gray-500">Total Tiers</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Eye className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.active}</p>
              <p className="text-sm text-gray-500">Active</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gray-100 rounded-lg">
              <EyeOff className="w-5 h-5 text-gray-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.inactive}</p>
              <p className="text-sm text-gray-500">Inactive</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Star className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.popular}</p>
              <p className="text-sm text-gray-500">Popular</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <DollarSign className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">${stats.avgPrice}</p>
              <p className="text-sm text-gray-500">Avg Price</p>
            </div>
          </div>
        </div>
      </div>

      {/* Permission Notice */}
      {!canEdit() && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-yellow-800">View Only Mode</p>
            <p className="text-sm text-yellow-700">You don&apos;t have permission to edit membership tiers. Contact an admin for access.</p>
          </div>
        </div>
      )}

      {/* Membership Tiers */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        {membershipTiers.map((tier) => (
          <div
            key={tier.id}
            className={`bg-white rounded-xl p-6 shadow-sm border-2 ${tier.isPopular ? 'border-[#8B1538]' : 'border-transparent'
              } ${!tier.isActive ? 'opacity-60' : ''}`}
          >
            {editingId === tier.id ? (
              // Edit Mode
              <div className="space-y-4">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Name (English)</label>
                  <input
                    type="text"
                    value={editData.name || ''}
                    onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white text-gray-900"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Name (Tamil)</label>
                  <input
                    type="text"
                    value={editData.nameTamil || ''}
                    onChange={(e) => setEditData({ ...editData, nameTamil: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white text-gray-900"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Price ($)</label>
                  <input
                    type="number"
                    value={editData.price || 0}
                    onChange={(e) => setEditData({ ...editData, price: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white text-gray-900"
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Features (one per line)</label>
                  <textarea
                    value={editData.features?.join('\n') || ''}
                    onChange={(e) => setEditData({ ...editData, features: e.target.value.split('\n') })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm resize-none bg-white text-gray-900"
                    rows={4}
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Features (Tamil, one per line)</label>
                  <textarea
                    value={editData.featuresTamil?.join('\n') || ''}
                    onChange={(e) => setEditData({ ...editData, featuresTamil: e.target.value.split('\n') })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm resize-none bg-white text-gray-900"
                    rows={4}
                  />
                </div>
                <div className="flex gap-2">
                  <label className="flex items-center text-sm">
                    <input
                      type="checkbox"
                      checked={editData.isPopular || false}
                      onChange={(e) => setEditData({ ...editData, isPopular: e.target.checked })}
                      className="mr-2"
                    />
                    Popular
                  </label>
                  <label className="flex items-center text-sm">
                    <input
                      type="checkbox"
                      checked={editData.isActive || false}
                      onChange={(e) => setEditData({ ...editData, isActive: e.target.checked })}
                      className="mr-2"
                    />
                    Active
                  </label>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={cancelEdit}
                    className="flex-1 px-3 py-2 border border-gray-300 text-gray-600 rounded-lg text-sm hover:bg-gray-50"
                  >
                    <X className="w-4 h-4 inline mr-1" />
                    Cancel
                  </button>
                  <button
                    onClick={saveEdit}
                    className="flex-1 px-3 py-2 bg-[#8B1538] text-white rounded-lg text-sm hover:bg-[#6B1028]"
                  >
                    <Save className="w-4 h-4 inline mr-1" />
                    Save
                  </button>
                </div>
              </div>
            ) : (
              // View Mode
              <>
                {tier.isPopular && (
                  <div className="flex items-center justify-center mb-3">
                    <span className="bg-[#8B1538] text-white px-3 py-1 rounded-full text-xs font-bold flex items-center">
                      <Star className="w-3 h-3 mr-1" />
                      POPULAR
                    </span>
                  </div>
                )}
                <div className="text-center mb-4">
                  <h3 className="text-lg font-bold text-gray-900">{tier.name}</h3>
                  <p className="text-sm text-gray-500">{tier.nameTamil}</p>
                </div>
                <div className="text-center mb-4">
                  <span className="text-3xl font-bold text-[#8B1538]">${tier.price}</span>
                  <span className="text-gray-600">/year</span>
                </div>
                <ul className="space-y-2 mb-4">
                  {tier.features.map((feature, i) => (
                    <li key={i} className="text-sm text-gray-600 flex items-start">
                      <span className="text-green-500 mr-2">✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>
                {!tier.isActive && (
                  <p className="text-xs text-red-500 text-center mb-3">Currently inactive</p>
                )}

                {/* Quick Actions */}
                {canEdit() && (
                  <div className="flex gap-2 mb-3">
                    <button
                      onClick={() => toggleActive(tier)}
                      className={`flex-1 px-2 py-1.5 rounded-lg text-xs font-medium transition-colors ${tier.isActive
                          ? 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          : 'bg-green-100 text-green-600 hover:bg-green-200'
                        }`}
                      title={tier.isActive ? 'Deactivate' : 'Activate'}
                    >
                      {tier.isActive ? (
                        <><EyeOff className="w-3 h-3 inline mr-1" /> Hide</>
                      ) : (
                        <><Eye className="w-3 h-3 inline mr-1" /> Show</>
                      )}
                    </button>
                    <button
                      onClick={() => togglePopular(tier)}
                      className={`flex-1 px-2 py-1.5 rounded-lg text-xs font-medium transition-colors ${tier.isPopular
                          ? 'bg-yellow-100 text-yellow-600 hover:bg-yellow-200'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      title={tier.isPopular ? 'Remove popular badge' : 'Set as popular'}
                    >
                      <Star className={`w-3 h-3 inline mr-1 ${tier.isPopular ? 'fill-yellow-500' : ''}`} />
                      {tier.isPopular ? 'Popular' : 'Set Popular'}
                    </button>
                  </div>
                )}

                {canEdit() && (
                  <button
                    onClick={() => startEdit(tier)}
                    className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm flex items-center justify-center"
                  >
                    <Edit2 className="w-4 h-4 mr-2" />
                    Edit Tier
                  </button>
                )}
              </>
            )}
          </div>
        ))}
      </div>

      {/* Info Box */}
      <div className="bg-blue-50 rounded-xl p-6">
        <h3 className="font-semibold text-blue-900 mb-2">
          <DollarSign className="w-5 h-5 inline mr-1" />
          Pricing Note
        </h3>
        <p className="text-sm text-blue-800">
          Membership pricing follows the TC Hamilton model with accessible pricing to maximize community participation.
          The &quot;Popular&quot; badge helps highlight your recommended tier. Only one tier can be marked as popular at a time.
        </p>
      </div>
    </div>
  );
}
