'use client';

import { useState } from 'react';
import { useAdmin, Event } from '@/contexts/AdminContext';
import { Plus, Edit2, Trash2, Calendar, X, Save, Star, Search, Filter, Download, Copy, Eye, EyeOff, MapPin, Clock, AlertCircle } from 'lucide-react';

const defaultEvent: Omit<Event, 'id'> = {
  title: '',
  titleTamil: '',
  date: '',
  time: '',
  venue: '',
  venueTamil: '',
  address: '',
  description: '',
  descriptionTamil: '',
  highlights: ['', '', ''],
  highlightsTamil: ['', '', ''],
  image: '',
  category: 'cultural',
  pricing: { members: 0, nonMembers: 0, family: 0 },
  isFeatured: false,
  isActive: true,
};

export default function EventsPage() {
  const { events, addEvent, updateEvent, deleteEvent, canEdit, canDelete } = useAdmin();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [formData, setFormData] = useState<Omit<Event, 'id'>>(defaultEvent);
  const [membersFree, setMembersFree] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');

  const categories = [
    { value: 'cultural', label: 'Cultural', color: 'bg-purple-100 text-purple-700' },
    { value: 'religious', label: 'Religious', color: 'bg-orange-100 text-orange-700' },
    { value: 'sports', label: 'Sports', color: 'bg-green-100 text-green-700' },
    { value: 'youth', label: 'Youth', color: 'bg-blue-100 text-blue-700' },
    { value: 'seniors', label: 'Seniors', color: 'bg-amber-100 text-amber-700' },
    { value: 'community', label: 'Community', color: 'bg-pink-100 text-pink-700' },
  ];

  // Filter and search
  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.titleTamil.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.venue.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || event.category === filterCategory;
    const matchesStatus = filterStatus === 'all' ||
      (filterStatus === 'active' && event.isActive) ||
      (filterStatus === 'inactive' && !event.isActive) ||
      (filterStatus === 'featured' && event.isFeatured);
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const sortedEvents = [...filteredEvents].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // Stats
  const stats = {
    total: events.length,
    active: events.filter(e => e.isActive).length,
    featured: events.filter(e => e.isFeatured).length,
    upcoming: events.filter(e => new Date(e.date) >= new Date()).length,
  };

  const openAddModal = () => {
    if (!canEdit()) return;
    setEditingEvent(null);
    setFormData(defaultEvent);
    setMembersFree(false);
    setIsModalOpen(true);
  };

  const openEditModal = (event: Event) => {
    if (!canEdit()) return;
    setEditingEvent(event);
    setFormData({
      ...event,
      highlights: event.highlights.length >= 3 ? event.highlights : [...event.highlights, '', '', ''].slice(0, 3),
      highlightsTamil: event.highlightsTamil.length >= 3 ? event.highlightsTamil : [...event.highlightsTamil, '', '', ''].slice(0, 3),
    });
    setMembersFree(event.pricing.members === 'FREE');
    setIsModalOpen(true);
  };

  const duplicateEvent = (event: Event) => {
    if (!canEdit()) return;
    setEditingEvent(null);
    setFormData({
      ...event,
      title: event.title + ' (Copy)',
      date: '',
      highlights: event.highlights.length >= 3 ? event.highlights : [...event.highlights, '', '', ''].slice(0, 3),
      highlightsTamil: event.highlightsTamil.length >= 3 ? event.highlightsTamil : [...event.highlightsTamil, '', '', ''].slice(0, 3),
      isActive: false,
    });
    setMembersFree(event.pricing.members === 'FREE');
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const eventData = {
      ...formData,
      highlights: formData.highlights.filter(h => h.trim()),
      highlightsTamil: formData.highlightsTamil.filter(h => h.trim()),
      pricing: {
        ...formData.pricing,
        members: membersFree ? 'FREE' as const : formData.pricing.members,
      },
    };

    if (editingEvent) {
      updateEvent(editingEvent.id, eventData);
    } else {
      addEvent(eventData);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (!canDelete()) return;
    if (confirm('Are you sure you want to delete this event?')) {
      deleteEvent(id);
    }
  };

  const toggleActive = (event: Event) => {
    if (!canEdit()) return;
    updateEvent(event.id, { isActive: !event.isActive });
  };

  const toggleFeatured = (event: Event) => {
    if (!canEdit()) return;
    updateEvent(event.id, { isFeatured: !event.isFeatured });
  };

  const exportEvents = () => {
    const data = events.map(e => ({
      title: e.title,
      titleTamil: e.titleTamil,
      date: e.date,
      time: e.time,
      venue: e.venue,
      category: e.category,
      isActive: e.isActive,
      isFeatured: e.isFeatured,
    }));
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'events-export.json';
    a.click();
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const isUpcoming = (dateStr: string) => {
    return new Date(dateStr) >= new Date();
  };

  const getCategoryColor = (category: string) => {
    return categories.find(c => c.value === category)?.color || 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Events Management</h2>
          <p className="text-gray-600">Create and manage your community events</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={exportEvents}
            className="inline-flex items-center px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm"
          >
            <Download className="w-4 h-4 mr-2" />
            Export
          </button>
          {canEdit() && (
            <button
              onClick={openAddModal}
              className="inline-flex items-center px-4 py-2 bg-[#8B1538] text-white rounded-lg font-semibold hover:bg-[#6B1028] transition-colors"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add Event
            </button>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
          <p className="text-sm text-gray-500">Total Events</p>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <p className="text-2xl font-bold text-green-600">{stats.upcoming}</p>
          <p className="text-sm text-gray-500">Upcoming</p>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <p className="text-2xl font-bold text-yellow-600">{stats.featured}</p>
          <p className="text-sm text-gray-500">Featured</p>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <p className="text-2xl font-bold text-blue-600">{stats.active}</p>
          <p className="text-sm text-gray-500">Active</p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search events..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#8B1538] focus:border-transparent outline-none bg-white text-gray-900"
          />
        </div>
        <div className="flex gap-2">
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#8B1538] focus:border-transparent outline-none bg-white text-gray-900"
          >
            <option value="all">All Categories</option>
            {categories.map(c => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#8B1538] focus:border-transparent outline-none bg-white text-gray-900"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="featured">Featured</option>
          </select>
        </div>
      </div>

      {/* Permission Notice */}
      {!canEdit() && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-amber-800">View Only Mode</p>
            <p className="text-sm text-amber-700">You don&apos;t have permission to edit events. Contact an admin for access.</p>
          </div>
        </div>
      )}

      {/* Events List */}
      {events.length === 0 ? (
        <div className="bg-white rounded-xl p-12 text-center">
          <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No Events Yet</h3>
          <p className="text-gray-600 mb-6">Create your first event to display on the website</p>
          {canEdit() && (
            <button
              onClick={openAddModal}
              className="inline-flex items-center px-6 py-3 bg-[#8B1538] text-white rounded-lg font-semibold hover:bg-[#6B1028] transition-colors"
            >
              <Plus className="w-5 h-5 mr-2" />
              Create First Event
            </button>
          )}
        </div>
      ) : sortedEvents.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl">
          <Filter className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 font-medium">No events found</p>
          <p className="text-gray-400 text-sm">Try adjusting your search or filters</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Event</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Time</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {sortedEvents.map((event) => (
                  <tr key={event.id} className={`hover:bg-gray-50 ${!event.isActive ? 'opacity-50' : ''}`}>
                    <td className="px-6 py-4">
                      <div className="flex items-start gap-3">
                        {event.image && (
                          <img src={event.image} alt="" className="w-16 h-12 object-cover rounded" />
                        )}
                        <div>
                          <div className="flex items-center gap-2">
                            {event.isFeatured && <Star className="w-4 h-4 text-yellow-500 fill-current" />}
                            <p className="font-medium text-gray-900">{event.title}</p>
                          </div>
                          <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                            <MapPin className="w-3 h-3" />
                            {event.venue}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <div>
                          <p className={`text-sm font-medium ${isUpcoming(event.date) ? 'text-green-600' : 'text-gray-600'}`}>
                            {formatDate(event.date)}
                          </p>
                          <p className="text-xs text-gray-400 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {event.time}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getCategoryColor(event.category)}`}>
                        {event.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => toggleActive(event)}
                          disabled={!canEdit()}
                          className={`p-1.5 rounded transition-colors ${
                            event.isActive
                              ? 'bg-green-100 text-green-600 hover:bg-green-200'
                              : 'bg-red-100 text-red-600 hover:bg-red-200'
                          } ${!canEdit() ? 'opacity-50 cursor-not-allowed' : ''}`}
                          title={event.isActive ? 'Active' : 'Inactive'}
                        >
                          {event.isActive ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                        </button>
                        <button
                          onClick={() => toggleFeatured(event)}
                          disabled={!canEdit()}
                          className={`p-1.5 rounded transition-colors ${
                            event.isFeatured
                              ? 'bg-yellow-100 text-yellow-600 hover:bg-yellow-200'
                              : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                          } ${!canEdit() ? 'opacity-50 cursor-not-allowed' : ''}`}
                          title={event.isFeatured ? 'Featured' : 'Not Featured'}
                        >
                          <Star className={`w-4 h-4 ${event.isFeatured ? 'fill-current' : ''}`} />
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        {canEdit() && (
                          <>
                            <button
                              onClick={() => openEditModal(event)}
                              className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                              title="Edit"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => duplicateEvent(event)}
                              className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                              title="Duplicate"
                            >
                              <Copy className="w-4 h-4" />
                            </button>
                          </>
                        )}
                        {canDelete() && (
                          <button
                            onClick={() => handleDelete(event.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b sticky top-0 bg-white z-10">
              <h3 className="text-xl font-bold text-gray-900">
                {editingEvent ? 'Edit Event' : 'Create New Event'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Basic Info */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Event Title (English) *</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B1538] focus:border-transparent outline-none bg-white text-gray-900"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Event Title (Tamil) *</label>
                  <input
                    type="text"
                    value={formData.titleTamil}
                    onChange={(e) => setFormData({ ...formData, titleTamil: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B1538] focus:border-transparent outline-none bg-white text-gray-900"
                    required
                  />
                </div>
              </div>

              {/* Date, Time, Category */}
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date *</label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B1538] focus:border-transparent outline-none bg-white text-gray-900"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Time *</label>
                  <input
                    type="text"
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B1538] focus:border-transparent outline-none bg-white text-gray-900"
                    placeholder="e.g., 4:00 PM - 10:00 PM"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as Event['category'] })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B1538] focus:border-transparent outline-none bg-white text-gray-900"
                  >
                    {categories.map((cat) => (
                      <option key={cat.value} value={cat.value}>{cat.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Venue */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Venue (English) *</label>
                  <input
                    type="text"
                    value={formData.venue}
                    onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B1538] focus:border-transparent outline-none bg-white text-gray-900"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Venue (Tamil) *</label>
                  <input
                    type="text"
                    value={formData.venueTamil}
                    onChange={(e) => setFormData({ ...formData, venueTamil: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B1538] focus:border-transparent outline-none bg-white text-gray-900"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Address</label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B1538] focus:border-transparent outline-none bg-white text-gray-900"
                  placeholder="123 Street Name, City, ON"
                />
              </div>

              {/* Description */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description (English) *</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B1538] focus:border-transparent outline-none resize-none bg-white text-gray-900"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description (Tamil) *</label>
                  <textarea
                    value={formData.descriptionTamil}
                    onChange={(e) => setFormData({ ...formData, descriptionTamil: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B1538] focus:border-transparent outline-none resize-none bg-white text-gray-900"
                    required
                  />
                </div>
              </div>

              {/* Highlights */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Highlights (English)</label>
                  {formData.highlights.map((h, i) => (
                    <input
                      key={i}
                      type="text"
                      value={h}
                      onChange={(e) => {
                        const newHighlights = [...formData.highlights];
                        newHighlights[i] = e.target.value;
                        setFormData({ ...formData, highlights: newHighlights });
                      }}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B1538] focus:border-transparent outline-none mb-2 bg-white text-gray-900"
                      placeholder={`Highlight ${i + 1}`}
                    />
                  ))}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Highlights (Tamil)</label>
                  {formData.highlightsTamil.map((h, i) => (
                    <input
                      key={i}
                      type="text"
                      value={h}
                      onChange={(e) => {
                        const newHighlights = [...formData.highlightsTamil];
                        newHighlights[i] = e.target.value;
                        setFormData({ ...formData, highlightsTamil: newHighlights });
                      }}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B1538] focus:border-transparent outline-none mb-2 bg-white text-gray-900"
                      placeholder={`Highlight ${i + 1}`}
                    />
                  ))}
                </div>
              </div>

              {/* Pricing */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Pricing</label>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Members</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="membersFree"
                        checked={membersFree}
                        onChange={(e) => setMembersFree(e.target.checked)}
                      />
                      <label htmlFor="membersFree" className="text-sm">FREE</label>
                    </div>
                    {!membersFree && (
                      <input
                        type="number"
                        value={formData.pricing.members as number}
                        onChange={(e) => setFormData({ ...formData, pricing: { ...formData.pricing, members: Number(e.target.value) } })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B1538] focus:border-transparent outline-none mt-2 bg-white text-gray-900"
                        min="0"
                        placeholder="$"
                      />
                    )}
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Non-Members ($)</label>
                    <input
                      type="number"
                      value={formData.pricing.nonMembers}
                      onChange={(e) => setFormData({ ...formData, pricing: { ...formData.pricing, nonMembers: Number(e.target.value) } })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B1538] focus:border-transparent outline-none bg-white text-gray-900"
                      min="0"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Family ($)</label>
                    <input
                      type="number"
                      value={formData.pricing.family}
                      onChange={(e) => setFormData({ ...formData, pricing: { ...formData.pricing, family: Number(e.target.value) } })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B1538] focus:border-transparent outline-none bg-white text-gray-900"
                      min="0"
                    />
                  </div>
                </div>
              </div>

              {/* Image URL with Preview */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Event Image URL</label>
                <input
                  type="url"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B1538] focus:border-transparent outline-none bg-white text-gray-900"
                  placeholder="https://example.com/event-image.jpg"
                />
                {formData.image && (
                  <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-500 mb-2">Preview:</p>
                    <img
                      src={formData.image}
                      alt="Event preview"
                      className="max-h-32 object-contain rounded"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  </div>
                )}
              </div>

              {/* Toggles */}
              <div className="flex gap-6 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isFeatured"
                    checked={formData.isFeatured}
                    onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                    className="w-4 h-4 text-[#8B1538] border-gray-300 rounded focus:ring-[#8B1538]"
                  />
                  <label htmlFor="isFeatured" className="ml-2 text-sm text-gray-700 flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500" />
                    Featured Event
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isActiveEvent"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="w-4 h-4 text-[#8B1538] border-gray-300 rounded focus:ring-[#8B1538]"
                  />
                  <label htmlFor="isActiveEvent" className="ml-2 text-sm text-gray-700">
                    Active (visible on website)
                  </label>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 flex items-center justify-center px-4 py-2.5 bg-[#8B1538] text-white rounded-lg hover:bg-[#6B1028] transition-colors font-medium"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {editingEvent ? 'Update' : 'Create'} Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
