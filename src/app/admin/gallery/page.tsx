'use client';

import { useState, useMemo } from 'react';
import { useAdmin, GalleryImage } from '@/contexts/AdminContext';
import {
  Plus, Edit2, Trash2, X, Save, Image as ImageIcon, Search,
  Download, Copy, Filter, Eye, EyeOff, BarChart3, Calendar
} from 'lucide-react';

const defaultGalleryImage: Omit<GalleryImage, 'id'> = {
  title: '',
  titleTamil: '',
  event: '',
  eventTamil: '',
  year: new Date().getFullYear().toString(),
  image: '',
  isActive: true,
};

export default function GalleryPage() {
  const { galleryImages, addGalleryImage, updateGalleryImage, deleteGalleryImage, canEdit, canDelete, logActivity } = useAdmin();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingImage, setEditingImage] = useState<GalleryImage | null>(null);
  const [formData, setFormData] = useState<Omit<GalleryImage, 'id'>>(defaultGalleryImage);
  const [previewModalImage, setPreviewModalImage] = useState<string | null>(null);

  // Search and filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [filterYear, setFilterYear] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');

  // Get unique years
  const uniqueYears = useMemo(() => {
    const years = [...new Set(galleryImages.map(img => img.year))];
    return years.sort((a, b) => Number(b) - Number(a));
  }, [galleryImages]);

  // Filtered images
  const filteredImages = useMemo(() => {
    return galleryImages.filter(img => {
      const matchesSearch = searchTerm === '' ||
        img.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        img.titleTamil.includes(searchTerm) ||
        img.event.toLowerCase().includes(searchTerm.toLowerCase()) ||
        img.eventTamil.includes(searchTerm);

      const matchesYear = filterYear === 'all' || img.year === filterYear;
      const matchesStatus = filterStatus === 'all' ||
        (filterStatus === 'active' && img.isActive) ||
        (filterStatus === 'inactive' && !img.isActive);

      return matchesSearch && matchesYear && matchesStatus;
    });
  }, [galleryImages, searchTerm, filterYear, filterStatus]);

  // Stats
  const stats = useMemo(() => ({
    total: galleryImages.length,
    active: galleryImages.filter(img => img.isActive).length,
    inactive: galleryImages.filter(img => !img.isActive).length,
    thisYear: galleryImages.filter(img => img.year === new Date().getFullYear().toString()).length,
  }), [galleryImages]);

  // Group filtered images by year
  const groupedByYear = useMemo(() => {
    return filteredImages.reduce((acc, img) => {
      const year = img.year;
      if (!acc[year]) acc[year] = [];
      acc[year].push(img);
      return acc;
    }, {} as Record<string, GalleryImage[]>);
  }, [filteredImages]);

  const years = Object.keys(groupedByYear).sort((a, b) => Number(b) - Number(a));

  const openAddModal = () => {
    if (!canEdit()) return;
    setEditingImage(null);
    setFormData(defaultGalleryImage);
    setIsModalOpen(true);
  };

  const openEditModal = (image: GalleryImage) => {
    if (!canEdit()) return;
    setEditingImage(image);
    setFormData({ ...image });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingImage) {
      updateGalleryImage(editingImage.id, formData);
      logActivity('Update Gallery', `Updated gallery image: ${formData.title}`);
    } else {
      addGalleryImage(formData);
      logActivity('Add Gallery', `Added gallery image: ${formData.title}`);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (image: GalleryImage) => {
    if (!canDelete()) return;
    if (confirm('Are you sure you want to delete this image?')) {
      deleteGalleryImage(image.id);
      logActivity('Delete Gallery', `Deleted gallery image: ${image.title}`);
    }
  };

  const handleDuplicate = (image: GalleryImage) => {
    if (!canEdit()) return;
    const duplicatedImage = {
      title: `${image.title} (Copy)`,
      titleTamil: `${image.titleTamil} (நகல்)`,
      event: image.event,
      eventTamil: image.eventTamil,
      year: image.year,
      image: image.image,
      isActive: false,
    };
    addGalleryImage(duplicatedImage);
    logActivity('Add Gallery', `Duplicated gallery image: ${image.title}`);
  };

  const toggleActive = (image: GalleryImage) => {
    if (!canEdit()) return;
    updateGalleryImage(image.id, { isActive: !image.isActive });
    logActivity('Update Gallery', `${image.isActive ? 'Deactivated' : 'Activated'} gallery image: ${image.title}`);
  };

  const exportGallery = () => {
    const data = filteredImages.map(img => ({
      title: img.title,
      titleTamil: img.titleTamil,
      event: img.event,
      eventTamil: img.eventTamil,
      year: img.year,
      image: img.image,
      status: img.isActive ? 'Active' : 'Inactive',
    }));

    const csv = [
      ['Title', 'Title (Tamil)', 'Event', 'Event (Tamil)', 'Year', 'Image URL', 'Status'],
      ...data.map(row => [row.title, row.titleTamil, row.event, row.eventTamil, row.year, row.image, row.status])
    ].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'gallery-export.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Gallery Management</h2>
          <p className="text-gray-600">Upload and manage your event photos</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={exportGallery}
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
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
              Add Image
            </button>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <BarChart3 className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              <p className="text-sm text-gray-500">Total Images</p>
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
            <div className="p-2 bg-purple-100 rounded-lg">
              <Calendar className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.thisYear}</p>
              <p className="text-sm text-gray-500">This Year</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by title or event..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B1538] focus:border-transparent outline-none bg-white text-gray-900"
            />
          </div>
          <div className="flex gap-2">
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <select
                value={filterYear}
                onChange={(e) => setFilterYear(e.target.value)}
                className="pl-9 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B1538] focus:border-transparent outline-none appearance-none bg-white text-gray-900"
              >
                <option value="all">All Years</option>
                {uniqueYears.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as 'all' | 'active' | 'inactive')}
                className="pl-9 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B1538] focus:border-transparent outline-none appearance-none bg-white text-gray-900"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
        </div>
        {(searchTerm || filterYear !== 'all' || filterStatus !== 'all') && (
          <div className="mt-3 flex items-center gap-2">
            <span className="text-sm text-gray-500">
              Showing {filteredImages.length} of {galleryImages.length} images
            </span>
            <button
              onClick={() => { setSearchTerm(''); setFilterYear('all'); setFilterStatus('all'); }}
              className="text-sm text-[#8B1538] hover:underline"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>

      {/* Gallery */}
      {filteredImages.length === 0 ? (
        <div className="bg-white rounded-xl p-12 text-center">
          <ImageIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {galleryImages.length === 0 ? 'No Gallery Images Yet' : 'No Images Found'}
          </h3>
          <p className="text-gray-600 mb-6">
            {galleryImages.length === 0
              ? 'Upload your first photo to showcase community events'
              : 'Try adjusting your search or filters'}
          </p>
          {galleryImages.length === 0 && canEdit() && (
            <button
              onClick={openAddModal}
              className="inline-flex items-center px-6 py-3 bg-[#8B1538] text-white rounded-lg font-semibold hover:bg-[#6B1028] transition-colors"
            >
              <Plus className="w-5 h-5 mr-2" />
              Upload First Image
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-8">
          {years.map((year) => (
            <div key={year}>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                {year}
                <span className="text-sm font-normal text-gray-500">
                  ({groupedByYear[year].length} images)
                </span>
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {groupedByYear[year].map((image) => (
                  <div
                    key={image.id}
                    className={`relative group rounded-xl overflow-hidden bg-white shadow-sm ${!image.isActive ? 'opacity-60' : ''
                      }`}
                  >
                    <div
                      className="aspect-square bg-gradient-to-br from-[#8B1538] to-[#6B1028] cursor-pointer"
                      onClick={() => image.image && setPreviewModalImage(image.image)}
                    >
                      {image.image ? (
                        <img src={image.image} alt={image.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-white/30">
                          <ImageIcon className="w-12 h-12" />
                        </div>
                      )}
                    </div>

                    {/* Overlay */}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-3">
                      <div className="flex justify-end gap-1">
                        {canEdit() && (
                          <>
                            <button
                              onClick={() => toggleActive(image)}
                              className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
                              title={image.isActive ? 'Deactivate' : 'Activate'}
                            >
                              {image.isActive ? (
                                <EyeOff className="w-4 h-4 text-white" />
                              ) : (
                                <Eye className="w-4 h-4 text-white" />
                              )}
                            </button>
                            <button
                              onClick={() => handleDuplicate(image)}
                              className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
                              title="Duplicate"
                            >
                              <Copy className="w-4 h-4 text-white" />
                            </button>
                            <button
                              onClick={() => openEditModal(image)}
                              className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
                              title="Edit"
                            >
                              <Edit2 className="w-4 h-4 text-white" />
                            </button>
                          </>
                        )}
                        {canDelete() && (
                          <button
                            onClick={() => handleDelete(image)}
                            className="p-2 bg-red-500/50 rounded-lg hover:bg-red-500/70 transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4 text-white" />
                          </button>
                        )}
                      </div>
                      <div>
                        <p className="text-white font-medium text-sm truncate">{image.title}</p>
                        <p className="text-white/70 text-xs truncate">{image.event}</p>
                      </div>
                    </div>

                    {!image.isActive && (
                      <div className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
                        Inactive
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b">
              <h3 className="text-xl font-bold text-gray-900">
                {editingImage ? 'Edit Image' : 'Add New Image'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Image URL *</label>
                <input
                  type="url"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B1538] focus:border-transparent outline-none bg-white text-gray-900"
                  placeholder="https://example.com/image.jpg"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  Upload to Imgur, Google Photos, or similar and paste the URL
                </p>
                {/* Image Preview */}
                {formData.image && (
                  <div className="mt-3">
                    <p className="text-xs text-gray-500 mb-1">Preview:</p>
                    <div className="relative w-32 h-32 bg-gray-100 rounded-lg overflow-hidden border">
                      <img
                        src={formData.image}
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

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title (English) *</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B1538] focus:border-transparent outline-none bg-white text-gray-900"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title (Tamil) *</label>
                  <input
                    type="text"
                    value={formData.titleTamil}
                    onChange={(e) => setFormData({ ...formData, titleTamil: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B1538] focus:border-transparent outline-none bg-white text-gray-900"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Event (English) *</label>
                  <input
                    type="text"
                    value={formData.event}
                    onChange={(e) => setFormData({ ...formData, event: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B1538] focus:border-transparent outline-none bg-white text-gray-900"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Event (Tamil) *</label>
                  <input
                    type="text"
                    value={formData.eventTamil}
                    onChange={(e) => setFormData({ ...formData, eventTamil: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B1538] focus:border-transparent outline-none bg-white text-gray-900"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Year *</label>
                <select
                  value={formData.year}
                  onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B1538] focus:border-transparent outline-none bg-white text-gray-900"
                  required
                >
                  {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - i).map(year => (
                    <option key={year} value={year.toString()}>{year}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="w-4 h-4 text-[#8B1538] border-gray-300 rounded focus:ring-[#8B1538]"
                />
                <label htmlFor="isActive" className="ml-2 text-sm text-gray-700">
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
                  {editingImage ? 'Update' : 'Add'} Image
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Image Preview Modal */}
      {previewModalImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80"
          onClick={() => setPreviewModalImage(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh]">
            <button
              onClick={() => setPreviewModalImage(null)}
              className="absolute -top-10 right-0 p-2 text-white hover:text-gray-300"
            >
              <X className="w-6 h-6" />
            </button>
            <img
              src={previewModalImage}
              alt="Preview"
              className="max-w-full max-h-[85vh] object-contain rounded-lg"
            />
          </div>
        </div>
      )}
    </div>
  );
}
