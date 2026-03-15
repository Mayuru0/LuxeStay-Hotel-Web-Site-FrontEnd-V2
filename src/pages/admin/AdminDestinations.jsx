import { useState, useEffect } from 'react';
import { MapPin, Plus, Pencil, Trash2, X, Globe } from 'lucide-react';
import Modal from '../../components/ui/Modal.jsx';
import toast from 'react-hot-toast';

const STORAGE_KEY = 'hotelDestinations';

const DEFAULT_DESTINATIONS = [
  {
    id: '1',
    name: 'Maldives Paradise',
    location: 'Maldives, Indian Ocean',
    description: 'Crystal clear waters, pristine white sand beaches and overwater bungalows.',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
  },
  {
    id: '2',
    name: 'Santorini Escape',
    location: 'Santorini, Greece',
    description: 'Iconic white-washed buildings, volcanic beaches and breathtaking Aegean sunsets.',
    image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800&q=80',
  },
  {
    id: '3',
    name: 'Bali Retreat',
    location: 'Bali, Indonesia',
    description: 'Tropical paradise with ancient temples, terraced rice fields and vibrant culture.',
    image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=80',
  },
  {
    id: '4',
    name: 'Paris Romance',
    location: 'Paris, France',
    description: 'The city of love — iconic landmarks, world-class cuisine and timeless elegance.',
    image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&q=80',
  },
  {
    id: '5',
    name: 'Dubai Luxury',
    location: 'Dubai, UAE',
    description: 'Ultramodern skyline, golden deserts and the pinnacle of luxury hospitality.',
    image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&q=80',
  },
];

const loadDestinations = () => {
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return Array.isArray(stored) && stored.length > 0 ? stored : DEFAULT_DESTINATIONS;
  } catch {
    return DEFAULT_DESTINATIONS;
  }
};

const saveDestinations = (items) =>
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));

const EMPTY_FORM = { name: '', location: '', description: '', image: '' };

const AdminDestinations = () => {
  const [destinations, setDestinations] = useState(loadDestinations);
  const [modal, setModal]               = useState({ open: false, editing: null });
  const [form, setForm]                 = useState(EMPTY_FORM);
  const [deleteId, setDeleteId]         = useState(null);

  /* Persist on every change */
  useEffect(() => { saveDestinations(destinations); }, [destinations]);

  const openAdd = () => {
    setForm(EMPTY_FORM);
    setModal({ open: true, editing: null });
  };

  const openEdit = (dest) => {
    setForm({ name: dest.name, location: dest.location, description: dest.description, image: dest.image });
    setModal({ open: true, editing: dest.id });
  };

  const closeModal = () => setModal({ open: false, editing: null });

  const handleSave = () => {
    if (!form.name.trim())  { toast.error('Name is required'); return; }
    if (!form.image.trim()) { toast.error('Image URL is required'); return; }

    if (modal.editing) {
      setDestinations((prev) =>
        prev.map((d) => d.id === modal.editing ? { ...d, ...form } : d)
      );
      toast.success('Destination updated!');
    } else {
      const newDest = { ...form, id: Date.now().toString() };
      setDestinations((prev) => [...prev, newDest]);
      toast.success('Destination added!');
    }
    closeModal();
  };

  const handleDelete = () => {
    setDestinations((prev) => prev.filter((d) => d.id !== deleteId));
    setDeleteId(null);
    toast.success('Destination deleted');
  };

  const handleResetDefaults = () => {
    setDestinations(DEFAULT_DESTINATIONS);
    toast.success('Reset to default destinations');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Globe size={20} className="text-blue-800" /> Manage Destinations
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            These appear as a carousel on the home page below the CTA section.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleResetDefaults}
            className="px-4 py-2 rounded-lg text-sm font-semibold text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 transition-colors"
          >
            Reset Defaults
          </button>
          <button
            onClick={openAdd}
            className="flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-semibold bg-blue-800 hover:bg-blue-900 text-white transition-colors"
          >
            <Plus size={16} /> Add Destination
          </button>
        </div>
      </div>

      {/* Grid */}
      {destinations.length === 0 ? (
        <div className="text-center py-20 text-gray-400 bg-white rounded-xl border border-gray-100">
          <Globe size={40} className="mx-auto mb-3 opacity-30" />
          <p>No destinations yet. Add your first one!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {destinations.map((dest, i) => (
            <div
              key={dest.id}
              className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 group"
            >
              {/* Image */}
              <div className="relative h-44 overflow-hidden bg-gray-100">
                {dest.image ? (
                  <img
                    src={dest.image}
                    alt={dest.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-300">
                    <MapPin size={36} />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-3 left-3">
                  <span className="bg-white/20 backdrop-blur text-white text-xs px-2 py-0.5 rounded-full border border-white/30">
                    #{i + 1}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                <h3 className="font-bold text-gray-900">{dest.name}</h3>
                <p className="text-amber-600 text-xs font-medium flex items-center gap-1 mt-0.5">
                  <MapPin size={11} /> {dest.location}
                </p>
                <p className="text-gray-500 text-sm mt-2 line-clamp-2">{dest.description}</p>

                <div className="flex items-center gap-2 mt-4">
                  <button
                    onClick={() => openEdit(dest)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 transition-colors"
                  >
                    <Pencil size={13} /> Edit
                  </button>
                  <button
                    onClick={() => setDeleteId(dest.id)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 transition-colors"
                  >
                    <Trash2 size={13} /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Modal */}
      <Modal
        isOpen={modal.open}
        onClose={closeModal}
        title={modal.editing ? 'Edit Destination' : 'Add Destination'}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name <span className="text-red-500">*</span>
            </label>
            <input
              value={form.name}
              onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
              placeholder="e.g. Maldives Paradise"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-800"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
            <input
              value={form.location}
              onChange={(e) => setForm((p) => ({ ...p, location: e.target.value }))}
              placeholder="e.g. Maldives, Indian Ocean"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-800"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              rows={3}
              value={form.description}
              onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
              placeholder="Short description of this destination..."
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-800 resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Image URL <span className="text-red-500">*</span>
            </label>
            <input
              value={form.image}
              onChange={(e) => setForm((p) => ({ ...p, image: e.target.value }))}
              placeholder="https://images.unsplash.com/..."
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-800"
            />
            {form.image && (
              <div className="relative mt-2 h-28 rounded-xl overflow-hidden bg-gray-100">
                <img
                  src={form.image}
                  alt="preview"
                  className="w-full h-full object-cover"
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-1">
            <button
              onClick={closeModal}
              className="px-4 py-2 rounded-lg text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-5 py-2 rounded-lg text-sm font-semibold bg-blue-800 hover:bg-blue-900 text-white transition-colors"
            >
              {modal.editing ? 'Save Changes' : 'Add Destination'}
            </button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirm Modal */}
      <Modal isOpen={!!deleteId} onClose={() => setDeleteId(null)} title="Delete Destination">
        <div className="space-y-4">
          <p className="text-gray-600 text-sm">
            Are you sure you want to delete this destination? This cannot be undone.
          </p>
          <div className="flex justify-end gap-3">
            <button
              onClick={() => setDeleteId(null)}
              className="px-4 py-2 rounded-lg text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              className="px-5 py-2 rounded-lg text-sm font-semibold bg-red-600 hover:bg-red-700 text-white transition-colors"
            >
              Delete
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default AdminDestinations;
