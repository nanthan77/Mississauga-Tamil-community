'use client';

import { useState, useEffect, useMemo } from 'react';
import { useAdmin, LeadershipMember } from '@/contexts/AdminContext';
import {
  Save, Plus, Edit2, Trash2, X, Users, Target, Eye, Search,
  Download, Copy, EyeOff, BarChart3, AlertCircle, Leaf, Heart, GraduationCap, BookOpen, Quote
} from 'lucide-react';

export default function AboutPage() {
  const {
    aboutContent,
    updateAboutContent,
    leadership,
    addLeadershipMember,
    updateLeadershipMember,
    deleteLeadershipMember,
    canEdit,
    canDelete,
    logActivity
  } = useAdmin();

  const [formData, setFormData] = useState(aboutContent);
  const [saved, setSaved] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<LeadershipMember | null>(null);
  const [memberForm, setMemberForm] = useState<Omit<LeadershipMember, 'id'>>({
    name: '',
    nameTamil: '',
    position: '',
    positionTamil: '',
    image: '',
    isActive: true,
  });

  // Search state for leadership
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');

  // Stats
  const stats = useMemo(() => ({
    total: leadership.length,
    active: leadership.filter(m => m.isActive).length,
    inactive: leadership.filter(m => !m.isActive).length,
  }), [leadership]);

  // Filtered leadership
  const filteredLeadership = useMemo(() => {
    return leadership.filter(member => {
      const matchesSearch = searchTerm === '' ||
        member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.nameTamil.includes(searchTerm) ||
        member.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.positionTamil.includes(searchTerm);

      const matchesStatus = filterStatus === 'all' ||
        (filterStatus === 'active' && member.isActive) ||
        (filterStatus === 'inactive' && !member.isActive);

      return matchesSearch && matchesStatus;
    });
  }, [leadership, searchTerm, filterStatus]);

  useEffect(() => {
    setFormData(aboutContent);
  }, [aboutContent]);

  const handleContentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canEdit()) return;
    updateAboutContent(formData);
    logActivity('Update About', 'Updated about content');
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const openAddMemberModal = () => {
    if (!canEdit()) return;
    setEditingMember(null);
    setMemberForm({
      name: '',
      nameTamil: '',
      position: '',
      positionTamil: '',
      image: '',
      isActive: true,
    });
    setIsModalOpen(true);
  };

  const openEditMemberModal = (member: LeadershipMember) => {
    if (!canEdit()) return;
    setEditingMember(member);
    setMemberForm({ ...member });
    setIsModalOpen(true);
  };

  const handleMemberSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingMember) {
      updateLeadershipMember(editingMember.id, memberForm);
      logActivity('Update Leadership', `Updated leadership member: ${memberForm.name}`);
    } else {
      addLeadershipMember(memberForm);
      logActivity('Add Leadership', `Added leadership member: ${memberForm.name}`);
    }
    setIsModalOpen(false);
  };

  const handleDeleteMember = (member: LeadershipMember) => {
    if (!canDelete()) return;
    if (confirm('Are you sure you want to delete this leadership member?')) {
      deleteLeadershipMember(member.id);
      logActivity('Delete Leadership', `Deleted leadership member: ${member.name}`);
    }
  };

  const handleDuplicate = (member: LeadershipMember) => {
    if (!canEdit()) return;
    const duplicated = {
      name: `${member.name} (Copy)`,
      nameTamil: `${member.nameTamil} (நகல்)`,
      position: member.position,
      positionTamil: member.positionTamil,
      image: member.image,
      isActive: false,
    };
    addLeadershipMember(duplicated);
    logActivity('Add Leadership', `Duplicated leadership member: ${member.name}`);
  };

  const toggleActive = (member: LeadershipMember) => {
    if (!canEdit()) return;
    updateLeadershipMember(member.id, { isActive: !member.isActive });
    logActivity('Update Leadership', `${member.isActive ? 'Deactivated' : 'Activated'} leadership member: ${member.name}`);
  };

  const exportLeadership = () => {
    const data = filteredLeadership.map(member => ({
      name: member.name,
      nameTamil: member.nameTamil,
      position: member.position,
      positionTamil: member.positionTamil,
      image: member.image,
      status: member.isActive ? 'Active' : 'Inactive',
    }));

    const csv = [
      ['Name', 'Name (Tamil)', 'Position', 'Position (Tamil)', 'Image URL', 'Status'],
      ...data.map(row => [row.name, row.nameTamil, row.position, row.positionTamil, row.image, row.status])
    ].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'leadership-export.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">About & Leadership</h2>
          <p className="text-gray-600">Manage your organization&apos;s about content and leadership team</p>
        </div>
        {saved && (
          <div className="px-4 py-2 bg-green-100 text-green-700 rounded-lg font-medium">
            Content saved successfully!
          </div>
        )}
      </div>

      {/* Permission Notice */}
      {!canEdit() && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-yellow-800">View Only Mode</p>
            <p className="text-sm text-yellow-700">You don&apos;t have permission to edit content. Contact an admin for access.</p>
          </div>
        </div>
      )}

      {/* About Content Form */}
      <form onSubmit={handleContentSubmit} className="space-y-6">
        {/* Introduction */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <BookOpen className="w-5 h-5 mr-2 text-[#8B1538]" />
            Introduction
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Introduction (English)</label>
              <textarea
                value={formData.intro || ''}
                onChange={(e) => setFormData({ ...formData, intro: e.target.value })}
                rows={4}
                disabled={!canEdit()}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B1538] focus:border-transparent outline-none resize-none bg-white text-gray-900 disabled:bg-gray-50 disabled:cursor-not-allowed"
                placeholder="Brief introduction about MTA..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Introduction (Tamil)</label>
              <textarea
                value={formData.introTamil || ''}
                onChange={(e) => setFormData({ ...formData, introTamil: e.target.value })}
                rows={4}
                disabled={!canEdit()}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B1538] focus:border-transparent outline-none resize-none bg-white text-gray-900 disabled:bg-gray-50 disabled:cursor-not-allowed"
                placeholder="அறிமுகம்..."
              />
            </div>
          </div>
        </div>

        {/* Motto */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Quote className="w-5 h-5 mr-2 text-[#D4AF37]" />
            Our Motto
          </h3>
          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Motto (English)</label>
              <input
                type="text"
                value={formData.motto || ''}
                onChange={(e) => setFormData({ ...formData, motto: e.target.value })}
                disabled={!canEdit()}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B1538] focus:border-transparent outline-none bg-white text-gray-900 disabled:bg-gray-50 disabled:cursor-not-allowed"
                placeholder="Unity is Strength"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Motto (Tamil)</label>
              <input
                type="text"
                value={formData.mottoTamil || ''}
                onChange={(e) => setFormData({ ...formData, mottoTamil: e.target.value })}
                disabled={!canEdit()}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B1538] focus:border-transparent outline-none bg-white text-gray-900 disabled:bg-gray-50 disabled:cursor-not-allowed"
                placeholder="ஒற்றுமையே பலம்"
              />
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Motto Description (English)</label>
              <textarea
                value={formData.mottoDescription || ''}
                onChange={(e) => setFormData({ ...formData, mottoDescription: e.target.value })}
                rows={3}
                disabled={!canEdit()}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B1538] focus:border-transparent outline-none resize-none bg-white text-gray-900 disabled:bg-gray-50 disabled:cursor-not-allowed"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Motto Description (Tamil)</label>
              <textarea
                value={formData.mottoDescriptionTamil || ''}
                onChange={(e) => setFormData({ ...formData, mottoDescriptionTamil: e.target.value })}
                rows={3}
                disabled={!canEdit()}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B1538] focus:border-transparent outline-none resize-none bg-white text-gray-900 disabled:bg-gray-50 disabled:cursor-not-allowed"
              />
            </div>
          </div>
        </div>

        {/* Mission */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Target className="w-5 h-5 mr-2 text-[#8B1538]" />
            Mission Statement
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mission (English)</label>
              <textarea
                value={formData.mission}
                onChange={(e) => setFormData({ ...formData, mission: e.target.value })}
                rows={4}
                disabled={!canEdit()}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B1538] focus:border-transparent outline-none resize-none bg-white text-gray-900 disabled:bg-gray-50 disabled:cursor-not-allowed"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mission (Tamil)</label>
              <textarea
                value={formData.missionTamil}
                onChange={(e) => setFormData({ ...formData, missionTamil: e.target.value })}
                rows={4}
                disabled={!canEdit()}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B1538] focus:border-transparent outline-none resize-none bg-white text-gray-900 disabled:bg-gray-50 disabled:cursor-not-allowed"
              />
            </div>
          </div>
        </div>

        {/* Vision */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Eye className="w-5 h-5 mr-2 text-[#8B1538]" />
            Vision Statement
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Vision (English)</label>
              <textarea
                value={formData.vision}
                onChange={(e) => setFormData({ ...formData, vision: e.target.value })}
                rows={4}
                disabled={!canEdit()}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B1538] focus:border-transparent outline-none resize-none bg-white text-gray-900 disabled:bg-gray-50 disabled:cursor-not-allowed"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Vision (Tamil)</label>
              <textarea
                value={formData.visionTamil}
                onChange={(e) => setFormData({ ...formData, visionTamil: e.target.value })}
                rows={4}
                disabled={!canEdit()}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B1538] focus:border-transparent outline-none resize-none bg-white text-gray-900 disabled:bg-gray-50 disabled:cursor-not-allowed"
              />
            </div>
          </div>
        </div>

        {/* Civic Leadership - Going Green */}
        <div className="bg-white rounded-xl p-6 shadow-sm border-l-4 border-l-green-500">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Leaf className="w-5 h-5 mr-2 text-green-600" />
            Civic Leadership: Going Green
          </h3>
          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Section Title (English)</label>
              <input
                type="text"
                value={formData.civicTitle || ''}
                onChange={(e) => setFormData({ ...formData, civicTitle: e.target.value })}
                disabled={!canEdit()}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B1538] focus:border-transparent outline-none bg-white text-gray-900 disabled:bg-gray-50 disabled:cursor-not-allowed"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Section Title (Tamil)</label>
              <input
                type="text"
                value={formData.civicTitleTamil || ''}
                onChange={(e) => setFormData({ ...formData, civicTitleTamil: e.target.value })}
                disabled={!canEdit()}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B1538] focus:border-transparent outline-none bg-white text-gray-900 disabled:bg-gray-50 disabled:cursor-not-allowed"
              />
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description (English)</label>
              <textarea
                value={formData.civicDescription || ''}
                onChange={(e) => setFormData({ ...formData, civicDescription: e.target.value })}
                rows={4}
                disabled={!canEdit()}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B1538] focus:border-transparent outline-none resize-none bg-white text-gray-900 disabled:bg-gray-50 disabled:cursor-not-allowed"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description (Tamil)</label>
              <textarea
                value={formData.civicDescriptionTamil || ''}
                onChange={(e) => setFormData({ ...formData, civicDescriptionTamil: e.target.value })}
                rows={4}
                disabled={!canEdit()}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B1538] focus:border-transparent outline-none resize-none bg-white text-gray-900 disabled:bg-gray-50 disabled:cursor-not-allowed"
              />
            </div>
          </div>
        </div>

        {/* Social Welfare - Annadhanam */}
        <div className="bg-white rounded-xl p-6 shadow-sm border-l-4 border-l-[#D4AF37]">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Heart className="w-5 h-5 mr-2 text-[#D4AF37]" />
            Social Welfare: Annadhanam
          </h3>
          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Section Title (English)</label>
              <input
                type="text"
                value={formData.socialTitle || ''}
                onChange={(e) => setFormData({ ...formData, socialTitle: e.target.value })}
                disabled={!canEdit()}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B1538] focus:border-transparent outline-none bg-white text-gray-900 disabled:bg-gray-50 disabled:cursor-not-allowed"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Section Title (Tamil)</label>
              <input
                type="text"
                value={formData.socialTitleTamil || ''}
                onChange={(e) => setFormData({ ...formData, socialTitleTamil: e.target.value })}
                disabled={!canEdit()}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B1538] focus:border-transparent outline-none bg-white text-gray-900 disabled:bg-gray-50 disabled:cursor-not-allowed"
              />
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description (English)</label>
              <textarea
                value={formData.socialDescription || ''}
                onChange={(e) => setFormData({ ...formData, socialDescription: e.target.value })}
                rows={4}
                disabled={!canEdit()}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B1538] focus:border-transparent outline-none resize-none bg-white text-gray-900 disabled:bg-gray-50 disabled:cursor-not-allowed"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description (Tamil)</label>
              <textarea
                value={formData.socialDescriptionTamil || ''}
                onChange={(e) => setFormData({ ...formData, socialDescriptionTamil: e.target.value })}
                rows={4}
                disabled={!canEdit()}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B1538] focus:border-transparent outline-none resize-none bg-white text-gray-900 disabled:bg-gray-50 disabled:cursor-not-allowed"
              />
            </div>
          </div>
        </div>

        {/* Youth Wing - PYDC */}
        <div className="bg-white rounded-xl p-6 shadow-sm border-l-4 border-l-blue-500">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <GraduationCap className="w-5 h-5 mr-2 text-blue-600" />
            Peel Youth Wing (PYDC)
          </h3>
          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Section Title (English)</label>
              <input
                type="text"
                value={formData.youthTitle || ''}
                onChange={(e) => setFormData({ ...formData, youthTitle: e.target.value })}
                disabled={!canEdit()}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B1538] focus:border-transparent outline-none bg-white text-gray-900 disabled:bg-gray-50 disabled:cursor-not-allowed"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Section Title (Tamil)</label>
              <input
                type="text"
                value={formData.youthTitleTamil || ''}
                onChange={(e) => setFormData({ ...formData, youthTitleTamil: e.target.value })}
                disabled={!canEdit()}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B1538] focus:border-transparent outline-none bg-white text-gray-900 disabled:bg-gray-50 disabled:cursor-not-allowed"
              />
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description (English)</label>
              <textarea
                value={formData.youthDescription || ''}
                onChange={(e) => setFormData({ ...formData, youthDescription: e.target.value })}
                rows={4}
                disabled={!canEdit()}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B1538] focus:border-transparent outline-none resize-none bg-white text-gray-900 disabled:bg-gray-50 disabled:cursor-not-allowed"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description (Tamil)</label>
              <textarea
                value={formData.youthDescriptionTamil || ''}
                onChange={(e) => setFormData({ ...formData, youthDescriptionTamil: e.target.value })}
                rows={4}
                disabled={!canEdit()}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B1538] focus:border-transparent outline-none resize-none bg-white text-gray-900 disabled:bg-gray-50 disabled:cursor-not-allowed"
              />
            </div>
          </div>
        </div>

        {/* History */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">History / Our Story</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">History (English)</label>
              <textarea
                value={formData.history}
                onChange={(e) => setFormData({ ...formData, history: e.target.value })}
                rows={4}
                disabled={!canEdit()}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B1538] focus:border-transparent outline-none resize-none bg-white text-gray-900 disabled:bg-gray-50 disabled:cursor-not-allowed"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">History (Tamil)</label>
              <textarea
                value={formData.historyTamil}
                onChange={(e) => setFormData({ ...formData, historyTamil: e.target.value })}
                rows={4}
                disabled={!canEdit()}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B1538] focus:border-transparent outline-none resize-none bg-white text-gray-900 disabled:bg-gray-50 disabled:cursor-not-allowed"
              />
            </div>
          </div>
        </div>

        {canEdit() && (
          <div className="flex justify-end">
            <button
              type="submit"
              className="inline-flex items-center px-6 py-3 bg-[#8B1538] text-white rounded-lg font-semibold hover:bg-[#6B1028] transition-colors"
            >
              <Save className="w-5 h-5 mr-2" />
              Save About Content
            </button>
          </div>
        )}
      </form>

      {/* Leadership Team Section */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <Users className="w-5 h-5 mr-2 text-[#8B1538]" />
            Leadership Team
          </h3>
          <div className="flex gap-2">
            <button
              onClick={exportLeadership}
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors text-sm"
            >
              <Download className="w-4 h-4 mr-2" />
              Export
            </button>
            {canEdit() && (
              <button
                onClick={openAddMemberModal}
                className="inline-flex items-center px-4 py-2 bg-[#8B1538] text-white rounded-lg font-semibold hover:bg-[#6B1028] transition-colors text-sm"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Member
              </button>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-blue-600" />
              <span className="text-lg font-bold text-gray-900">{stats.total}</span>
              <span className="text-sm text-gray-500">Total</span>
            </div>
          </div>
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4 text-green-600" />
              <span className="text-lg font-bold text-gray-900">{stats.active}</span>
              <span className="text-sm text-gray-500">Active</span>
            </div>
          </div>
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="flex items-center gap-2">
              <EyeOff className="w-4 h-4 text-gray-600" />
              <span className="text-lg font-bold text-gray-900">{stats.inactive}</span>
              <span className="text-sm text-gray-500">Inactive</span>
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name or position..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B1538] focus:border-transparent outline-none bg-white text-gray-900"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as 'all' | 'active' | 'inactive')}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B1538] focus:border-transparent outline-none bg-white text-gray-900"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        {(searchTerm || filterStatus !== 'all') && (
          <div className="mb-4 flex items-center gap-2">
            <span className="text-sm text-gray-500">
              Showing {filteredLeadership.length} of {leadership.length} members
            </span>
            <button
              onClick={() => { setSearchTerm(''); setFilterStatus('all'); }}
              className="text-sm text-[#8B1538] hover:underline"
            >
              Clear filters
            </button>
          </div>
        )}

        {/* Leadership Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {filteredLeadership.map((member) => (
            <div
              key={member.id}
              className={`text-center p-4 rounded-xl border ${member.isActive ? 'border-gray-200' : 'border-red-200 bg-red-50 opacity-60'
                }`}
            >
              <div className="w-20 h-20 bg-gray-200 rounded-full mx-auto mb-3 flex items-center justify-center overflow-hidden">
                {member.image ? (
                  <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
                ) : (
                  <Users className="w-8 h-8 text-gray-400" />
                )}
              </div>
              <h4 className="font-semibold text-gray-900">{member.name}</h4>
              <p className="text-sm text-gray-500 mb-1">{member.nameTamil}</p>
              <p className="text-sm text-[#8B1538] font-medium">{member.position}</p>
              <p className="text-xs text-gray-400">{member.positionTamil}</p>
              {!member.isActive && (
                <p className="text-xs text-red-500 mt-2">Inactive</p>
              )}
              <div className="flex justify-center gap-1 mt-3">
                {canEdit() && (
                  <>
                    <button
                      onClick={() => toggleActive(member)}
                      className={`p-2 rounded-lg transition-colors ${member.isActive
                          ? 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          : 'bg-green-100 text-green-600 hover:bg-green-200'
                        }`}
                      title={member.isActive ? 'Deactivate' : 'Activate'}
                    >
                      {member.isActive ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                    <button
                      onClick={() => handleDuplicate(member)}
                      className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
                      title="Duplicate"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => openEditMemberModal(member)}
                      className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
                      title="Edit"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                  </>
                )}
                {canDelete() && (
                  <button
                    onClick={() => handleDeleteMember(member)}
                    className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {filteredLeadership.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            {leadership.length === 0 ? 'No leadership members yet' : 'No members found matching your filters'}
          </div>
        )}
      </div>

      {/* Member Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b">
              <h3 className="text-xl font-bold text-gray-900">
                {editingMember ? 'Edit Member' : 'Add Leadership Member'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleMemberSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name (English) *</label>
                  <input
                    type="text"
                    value={memberForm.name}
                    onChange={(e) => setMemberForm({ ...memberForm, name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B1538] focus:border-transparent outline-none bg-white text-gray-900"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name (Tamil) *</label>
                  <input
                    type="text"
                    value={memberForm.nameTamil}
                    onChange={(e) => setMemberForm({ ...memberForm, nameTamil: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B1538] focus:border-transparent outline-none bg-white text-gray-900"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Position (English) *</label>
                  <input
                    type="text"
                    value={memberForm.position}
                    onChange={(e) => setMemberForm({ ...memberForm, position: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B1538] focus:border-transparent outline-none bg-white text-gray-900"
                    placeholder="e.g., President"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Position (Tamil) *</label>
                  <input
                    type="text"
                    value={memberForm.positionTamil}
                    onChange={(e) => setMemberForm({ ...memberForm, positionTamil: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B1538] focus:border-transparent outline-none bg-white text-gray-900"
                    placeholder="e.g., தலைவர்"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Photo URL</label>
                <input
                  type="url"
                  value={memberForm.image}
                  onChange={(e) => setMemberForm({ ...memberForm, image: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B1538] focus:border-transparent outline-none bg-white text-gray-900"
                  placeholder="https://example.com/photo.jpg"
                />
                {/* Image Preview */}
                {memberForm.image && (
                  <div className="mt-3">
                    <p className="text-xs text-gray-500 mb-1">Preview:</p>
                    <div className="w-20 h-20 bg-gray-100 rounded-full overflow-hidden border mx-auto">
                      <img
                        src={memberForm.image}
                        alt="Preview"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="memberActive"
                  checked={memberForm.isActive}
                  onChange={(e) => setMemberForm({ ...memberForm, isActive: e.target.checked })}
                  className="w-4 h-4 text-[#8B1538] border-gray-300 rounded focus:ring-[#8B1538]"
                />
                <label htmlFor="memberActive" className="ml-2 text-sm text-gray-700">
                  Active (visible on website)
                </label>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 flex items-center justify-center px-4 py-2 bg-[#8B1538] text-white rounded-lg hover:bg-[#6B1028] transition-colors"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {editingMember ? 'Update' : 'Add'} Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
