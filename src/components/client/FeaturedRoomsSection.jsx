import { useNavigate } from 'react-router-dom';
import RoomCard from './RoomCard.jsx';
import { ArrowRight, Sparkles } from 'lucide-react';
import useScrollReveal from '../../hooks/useScrollReveal.js';

const RoomCardSkeleton = () => (
  <div className="bg-white rounded-2xl shadow-md overflow-hidden flex flex-col">
    {/* Image area */}
    <div className="aspect-[4/3] bg-gray-300 animate-pulse" />

    <div className="p-5 flex flex-col flex-1 gap-3">
      {/* Title + price row */}
      <div className="flex items-start justify-between">
        <div className="h-5 bg-gray-200 rounded animate-pulse w-32" />
        <div className="h-5 bg-gray-200 rounded animate-pulse w-16" />
      </div>

      {/* Guests */}
      <div className="h-4 bg-gray-200 rounded animate-pulse w-28" />

      {/* Description lines */}
      <div className="flex flex-col gap-1.5">
        <div className="h-3 bg-gray-200 rounded animate-pulse w-full" />
        <div className="h-3 bg-gray-200 rounded animate-pulse w-4/5" />
      </div>

      {/* Feature tags */}
      <div className="flex gap-1.5">
        <div className="h-5 w-16 bg-gray-200 rounded-full animate-pulse" />
        <div className="h-5 w-20 bg-gray-200 rounded-full animate-pulse" />
        <div className="h-5 w-14 bg-gray-200 rounded-full animate-pulse" />
      </div>

      {/* Button */}
      <div className="h-10 bg-gray-200 rounded-xl animate-pulse mt-auto" />
    </div>
  </div>
);

const FeaturedRoomsSection = ({ rooms, loading, bgImage }) => {
  const navigate = useNavigate();
  const sectionRef = useScrollReveal(0.08);

  return (
    <section
      ref={sectionRef}
      className="py-24 relative bg-fixed bg-cover bg-center"
      style={{ backgroundImage: `url('${bgImage}')` }}
    >
      <div className="absolute inset-0 bg-black/65" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14 reveal">
          <p className="text-amber-400 font-semibold text-sm uppercase tracking-widest mb-2 flex items-center justify-center gap-2">
            <Sparkles size={14} /> Our Rooms
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-white">Featured Accommodations</h2>
          <div className="w-16 h-1 bg-amber-500 mx-auto mt-4 rounded-full" />
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(3)].map((_, i) => <RoomCardSkeleton key={i} />)}
          </div>
        ) : rooms.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <p>No rooms available yet. Check back soon!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {rooms.map((room, i) => (
              <div key={room._id} className={`reveal stagger-${i + 1}`}>
                <RoomCard room={room} />
              </div>
            ))}
          </div>
        )}

        <div className="text-center mt-12 reveal">
          <button
            onClick={() => navigate('/rooms')}
            className="btn-gradient inline-flex items-center gap-2 text-white font-semibold px-8 py-3.5 rounded-xl shadow-lg cursor-pointer"
          >
            View All Rooms <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedRoomsSection;
