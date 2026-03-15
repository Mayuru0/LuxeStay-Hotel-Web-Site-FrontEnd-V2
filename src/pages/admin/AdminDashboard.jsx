import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../config/api.js';
import Spinner from '../../components/ui/Spinner.jsx';
import Badge from '../../components/ui/Badge.jsx';
import Modal from '../../components/ui/Modal.jsx';
import toast from 'react-hot-toast';
import { formatCurrency, formatDate } from '../../utils/formatDate.js';
import {
  BedDouble, CalendarDays, Clock, CheckCircle, XCircle, DollarSign, Users,
  ArrowRight, MessageSquare, Mail, Image, Upload, X,
} from 'lucide-react';

const HOME_KEYS  = ['homeHero', 'homeRooms', 'homeCategories', 'homeCta'];
const PAGE_KEYS  = ['rooms', 'gallery', 'about', 'contact'];

const ALL_LABELS = {
  homeHero:       'Hero Section',
  homeRooms:      'Rooms Section',
  homeCategories: 'Categories Section',
  homeCta:        'CTA Section',
  rooms:          'Rooms Page',
  gallery:        'Gallery Page',
  about:          'About Page',
  contact:        'Contact Page',
};

const loadHeroImages = () => {
  try { return JSON.parse(localStorage.getItem('heroImages') || '{}'); } catch { return {}; }
};

/* Reusable image-picker card */
const ImagePickerCard = ({ pageKey, label, imgUrl, galleryItems, onChange }) => (
  <div className="border border-gray-200 rounded-xl overflow-hidden">
    <div className="h-28 bg-gray-100 relative">
      {imgUrl ? (
        <img src={imgUrl} alt={label} className="w-full h-full object-cover" />
      ) : (
        <div className="w-full h-full flex items-center justify-center text-gray-300">
          <Image size={28} />
        </div>
      )}
      <div className="absolute inset-0 bg-black/35 flex items-end p-2">
        <span className="text-white text-xs font-semibold">{label}</span>
      </div>
    </div>
    <div className="p-3 space-y-2">
      <select
        value={imgUrl}
        onChange={(e) => onChange(pageKey, e.target.value)}
        className="w-full border border-gray-200 rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-blue-800"
      >
        <option value="">— Select Image —</option>
        {galleryItems.map((item) => (
          <option key={item._id} value={item.image}>{item.name}</option>
        ))}
      </select>
      {imgUrl && (
        <button
          onClick={() => onChange(pageKey, '')}
          className="w-full text-xs text-red-500 hover:text-red-700 transition-colors"
        >
          Remove
        </button>
      )}
    </div>
  </div>
);

/* ── Custom background images stored SEPARATELY from gallery ── */
const BG_IMAGES_KEY = 'customBgImages';

const loadCustomBgImages = () => {
  try { return JSON.parse(localStorage.getItem(BG_IMAGES_KEY) || '[]'); } catch { return []; }
};

const EMPTY_FORM = { name: '', url: '' };

const PageHeroSettings = () => {
  const [galleryItems,  setGalleryItems]  = useState([]);
  const [customImages,  setCustomImages]  = useState(loadCustomBgImages);
  const [selected,      setSelected]      = useState(loadHeroImages);
  const [saved,         setSaved]         = useState(false);
  const [addOpen,       setAddOpen]       = useState(false);
  const [form,          setForm]          = useState(EMPTY_FORM);

  useEffect(() => {
    api.get('/api/gallery/get').then((res) => setGalleryItems(res.data.data || [])).catch(() => {});
  }, []);

  /* Save custom images to localStorage whenever they change */
  useEffect(() => {
    localStorage.setItem(BG_IMAGES_KEY, JSON.stringify(customImages));
  }, [customImages]);

  const handleChange = (key, value) => setSelected((prev) => ({ ...prev, [key]: value }));

  const handleSave = () => {
    localStorage.setItem('heroImages', JSON.stringify(selected));
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
    toast.success('Background images saved!');
  };

  const closeAdd = () => { setAddOpen(false); setForm(EMPTY_FORM); };

  const handleAddImage = () => {
    if (!form.name.trim()) { toast.error('Name is required'); return; }
    if (!form.url.trim())  { toast.error('Image URL is required'); return; }
    const newImg = { id: Date.now().toString(), name: form.name.trim(), image: form.url.trim() };
    setCustomImages((prev) => [...prev, newImg]);
    toast.success('Image saved to background library!');
    closeAdd();
  };

  const removeCustomImage = (id) => {
    setCustomImages((prev) => prev.filter((img) => img.id !== id));
  };

  /* Combined options for dropdowns: gallery items + custom bg images */
  const allOptions = [
    ...galleryItems.map((g) => ({ id: g._id, name: g.name, image: g.image, tag: 'Gallery' })),
    ...customImages.map((c) => ({ id: c.id, name: c.name, image: c.image, tag: 'Custom' })),
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <Image size={18} className="text-blue-800" />
          <h2 className="text-lg font-bold text-gray-900">Background Images</h2>
          <span className="text-xs text-gray-400 font-normal">(saved separately from gallery)</span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setAddOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold bg-amber-600 hover:bg-amber-700 text-white transition-colors"
          >
            <Upload size={15} /> Add Image URL
          </button>
          <button
            onClick={handleSave}
            className={`px-5 py-2 rounded-lg text-sm font-semibold transition-colors ${
              saved ? 'bg-green-600 text-white' : 'bg-blue-800 hover:bg-blue-900 text-white'
            }`}
          >
            {saved ? '✓ Saved!' : 'Save Changes'}
          </button>
        </div>
      </div>

      {/* Custom saved bg images strip */}
      {customImages.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">
            Custom Background Images
          </p>
          <div className="flex flex-wrap gap-2">
            {customImages.map((img) => (
              <div key={img.id} className="relative group w-20 h-14 rounded-lg overflow-hidden border border-gray-200">
                <img src={img.image} alt={img.name} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity gap-1">
                  <span className="text-white text-[9px] font-semibold text-center px-1 leading-tight line-clamp-1">{img.name}</span>
                  <button
                    onClick={() => removeCustomImage(img.id)}
                    className="bg-red-600 text-white rounded-full p-0.5 hover:bg-red-700"
                  >
                    <X size={10} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Home Page Sections */}
      <div>
        <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Home Page Sections</p>
        <div className="grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {HOME_KEYS.map((key) => (
            <ImagePickerCard
              key={key}
              pageKey={key}
              label={ALL_LABELS[key]}
              imgUrl={selected[key] || ''}
              galleryItems={allOptions}
              onChange={handleChange}
            />
          ))}
        </div>
      </div>

      {/* Other Pages */}
      <div>
        <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Other Pages</p>
        <div className="grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {PAGE_KEYS.map((key) => (
            <ImagePickerCard
              key={key}
              pageKey={key}
              label={ALL_LABELS[key]}
              imgUrl={selected[key] || ''}
              galleryItems={allOptions}
              onChange={handleChange}
            />
          ))}
        </div>
      </div>

      {/* ── Add Custom Image URL Modal ── */}
      <Modal isOpen={addOpen} onClose={closeAdd} title="Add Background Image URL">
        <div className="space-y-4">
          <p className="text-xs text-gray-500 bg-gray-50 rounded-lg px-3 py-2">
            This image is saved to your background image library only — it will <strong>not</strong> appear in the Gallery page.
          </p>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name <span className="text-red-500">*</span>
            </label>
            <input
              value={form.name}
              onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
              placeholder="e.g. Rooftop Pool Sunset"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-800"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Image URL <span className="text-red-500">*</span>
            </label>
            <input
              value={form.url}
              onChange={(e) => setForm((p) => ({ ...p, url: e.target.value }))}
              placeholder="https://images.unsplash.com/..."
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-800"
            />
            {form.url && (
              <div className="mt-2 h-28 rounded-xl overflow-hidden bg-gray-100">
                <img
                  src={form.url}
                  alt="preview"
                  className="w-full h-full object-cover"
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-1">
            <button
              onClick={closeAdd}
              className="px-4 py-2 rounded-lg text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleAddImage}
              className="px-5 py-2 rounded-lg text-sm font-semibold bg-blue-800 hover:bg-blue-900 text-white transition-colors"
            >
              Save to Library
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

const StatCard = ({ icon, label, value, color }) => (
  <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex items-center gap-4">
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
      {icon}
    </div>
    <div>
      <p className="text-2xl font-bold text-gray-900">{value ?? '—'}</p>
      <p className="text-sm text-gray-500">{label}</p>
    </div>
  </div>
);

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/api/admin/stats').then((res) => {
      setStats(res.data.data);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex justify-center py-24"><Spinner size="lg" /></div>;
  if (!stats) return <div className="text-center py-24 text-red-500">Failed to load stats</div>;

  const maxRevenue = Math.max(...(stats.monthlyRevenue?.map((m) => m.revenue) || [1]));

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
        <StatCard icon={<BedDouble size={22} className="text-blue-700" />} label="Total Rooms" value={stats.totalRooms} color="bg-blue-50" />
        <StatCard icon={<BedDouble size={22} className="text-green-700" />} label="Available Rooms" value={stats.availableRooms} color="bg-green-50" />
        <StatCard icon={<CalendarDays size={22} className="text-purple-700" />} label="Total Bookings" value={stats.totalBookings} color="bg-purple-50" />
        <StatCard icon={<Clock size={22} className="text-yellow-700" />} label="Pending Bookings" value={stats.pendingBookings} color="bg-yellow-50" />
        <StatCard icon={<CheckCircle size={22} className="text-emerald-700" />} label="Confirmed Bookings" value={stats.confirmedBookings} color="bg-emerald-50" />
        <StatCard icon={<XCircle size={22} className="text-red-700" />} label="Cancelled Bookings" value={stats.cancelledBookings} color="bg-red-50" />
        <StatCard icon={<DollarSign size={22} className="text-amber-700" />} label="Total Revenue" value={formatCurrency(stats.totalRevenue)} color="bg-amber-50" />
        <StatCard icon={<Users size={22} className="text-indigo-700" />} label="Total Users" value={stats.totalUsers} color="bg-indigo-50" />
        <StatCard icon={<MessageSquare size={22} className="text-rose-700" />} label="Unread Messages" value={stats.unreadMessages ?? 0} color="bg-rose-50" />
      </div>

      {/* Monthly Revenue Chart */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-6">Monthly Revenue (Last 6 Months)</h2>
        <div className="flex items-end gap-4 h-40">
          {stats.monthlyRevenue?.map((month) => {
            const heightPct = maxRevenue > 0 ? (month.revenue / maxRevenue) * 100 : 0;
            return (
              <div key={`${month.month}-${month.year}`} className="flex-1 flex flex-col items-center gap-2">
                <span className="text-xs text-gray-500">{formatCurrency(month.revenue)}</span>
                <div className="w-full rounded-t-md bg-blue-800 transition-all duration-500" style={{ height: `${Math.max(heightPct, 4)}%` }} />
                <span className="text-xs font-medium text-gray-600">{month.month}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Page Hero Images */}
      <PageHeroSettings />

      {/* Quick Links */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Manage Bookings', path: '/admin/bookings', color: 'bg-purple-800' },
          { label: 'Manage Rooms', path: '/admin/rooms', color: 'bg-blue-800' },
          { label: 'Manage Users', path: '/admin/users', color: 'bg-indigo-800' },
          { label: 'Manage Gallery', path: '/admin/gallery', color: 'bg-amber-700' },
          { label: 'View Messages', path: '/admin/contacts', color: 'bg-rose-700' },
        ].map((link) => (
          <Link
            key={link.path}
            to={link.path}
            className={`${link.color} text-white rounded-xl p-5 flex items-center justify-between hover:opacity-90 transition-opacity`}
          >
            <span className="font-semibold text-sm">{link.label}</span>
            <ArrowRight size={16} />
          </Link>
        ))}
      </div>

      {/* Recent Bookings */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-900">Recent Bookings</h2>
          <Link to="/admin/bookings" className="text-sm text-blue-800 hover:underline font-medium flex items-center gap-1">
            View all <ArrowRight size={14} />
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                {['Booking ID', 'Guest Email', 'Room', 'Check-In', 'Status', 'Amount'].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {(stats.recentBookings || []).slice(0, 5).map((b) => {
                const cat = b.roomId?.category || {};
                return (
                  <tr key={b._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-mono text-xs font-bold text-blue-800">{b.bookingId}</td>
                    <td className="px-4 py-3 text-gray-700">{b.email}</td>
                    <td className="px-4 py-3 text-gray-700">{cat.name || 'N/A'}</td>
                    <td className="px-4 py-3 text-gray-500">{formatDate(b.checkInDate)}</td>
                    <td className="px-4 py-3"><Badge status={b.status} /></td>
                    <td className="px-4 py-3 font-semibold text-gray-900">{formatCurrency(b.totalAmount)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Contact Messages */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <Mail size={18} className="text-rose-600" />
            <h2 className="text-lg font-bold text-gray-900">Recent Messages</h2>
            {stats.unreadMessages > 0 && (
              <span className="bg-rose-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                {stats.unreadMessages} new
              </span>
            )}
          </div>
        </div>

        {(stats.recentMessages || []).length === 0 ? (
          <div className="text-center py-10 text-gray-400 text-sm">No messages yet.</div>
        ) : (
          <div className="divide-y divide-gray-50">
            {(stats.recentMessages || []).map((msg) => (
              <div key={msg._id} className={`px-6 py-4 flex items-start gap-4 ${!msg.isRead ? 'bg-rose-50' : ''}`}>
                {/* Avatar */}
                <div className="w-9 h-9 rounded-full bg-rose-100 flex items-center justify-center shrink-0">
                  <MessageSquare size={15} className="text-rose-600" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-gray-900 text-sm">{msg.name}</span>
                    <span className="text-xs text-gray-400">{msg.email}</span>
                    {!msg.isRead && (
                      <span className="text-xs bg-rose-100 text-rose-600 font-semibold px-2 py-0.5 rounded-full">Unread</span>
                    )}
                  </div>
                  <p className="text-xs font-medium text-blue-800 mt-0.5">{msg.subject}</p>
                  <p className="text-sm text-gray-600 mt-1 line-clamp-2">{msg.message}</p>
                </div>

                <span className="text-xs text-gray-400 shrink-0 mt-0.5">{formatDate(msg.createdAt)}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
