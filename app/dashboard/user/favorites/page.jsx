'use client';

import { useState, useEffect } from 'react';
import axios from '@/lib/axios';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [removing, setRemoving] = useState(null);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const response = await axios.get('/api/favorites/my-favorites');
        setFavorites(response.data);
      } catch (error) {
        console.error('Error fetching favorites:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, []);

  const handleRemove = async (favoriteId) => {
    setRemoving(favoriteId);
    try {
      await axios.delete(`/api/favorites/${favoriteId}`);
      setFavorites(favorites.filter(f => f._id !== favoriteId));
      toast.success('Removed from favorites!');
    } catch (error) {
      toast.error('Failed to remove from favorites');
    } finally {
      setRemoving(null);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div>
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-black text-white">Favorite Classes</h1>
        <p className="text-neutral/60 text-sm mt-1">
          {favorites.length > 0 
            ? `You have ${favorites.length} favorite class${favorites.length > 1 ? 'es' : ''}`
            : "You haven't added any favorites yet"}
        </p>
      </div>

      {/* Favorites Grid */}
      {favorites.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {favorites.map((fav) => (
            <div
              key={fav._id}
              className="group bg-white/5 border border-white/10 hover:border-primary/30 rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/5"
            >
              {/* Image */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={fav.image}
                  alt={fav.className}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-base-200 via-transparent to-transparent"></div>
              </div>

              {/* Content */}
              <div className="p-5">
                <h3 className="text-white font-bold text-lg mb-1 truncate">
                  {fav.className}
                </h3>
                <p className="text-neutral text-sm mb-2">by {fav.trainerName}</p>
                
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">
                    {fav.category}
                  </span>
                  <p className="text-primary font-black text-lg">${fav.price}</p>
                </div>

                <div className="flex items-center gap-3">
                  <Link
                    href={`/classes/${fav.classId}`}
                    className="flex-1 text-center py-2 rounded-xl text-sm font-medium bg-white/5 text-white hover:bg-white/10 transition-colors"
                  >
                    View Details
                  </Link>
                  <button
                    onClick={() => handleRemove(fav._id)}
                    disabled={removing === fav._id}
                    className="px-4 py-2 rounded-xl text-sm font-medium bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors disabled:opacity-50"
                  >
                    {removing === fav._id ? '...' : 'Remove'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white/5 border border-white/10 rounded-2xl">
          <p className="text-5xl mb-4">❤️</p>
          <h3 className="text-xl font-bold text-white mb-2">No Favorites Yet</h3>
          <p className="text-neutral/60 text-sm">
            Browse classes and click the heart icon to save your favorites!
          </p>
          <Link
            href="/classes"
            className="inline-block mt-4 px-6 py-2 bg-gradient-to-r from-primary to-accent rounded-full text-black font-bold text-sm hover:scale-105 transition-transform"
          >
            Browse Classes →
          </Link>
        </div>
      )}
    </div>
  );
}