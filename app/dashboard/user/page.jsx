'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/providers/AuthProvider';
import axios from '@/lib/axios';
import StatCard from '@/components/dashboard/StatCard';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import Image from 'next/image';

export default function UserDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ bookings: 0, favorites: 0 });
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [bookingsRes, favoritesRes, appRes] = await Promise.all([
          axios.get('/api/bookings/my-bookings'),
          axios.get('/api/favorites/my-favorites'),
          axios.get('/api/trainers/application-status'),
        ]);

        setStats({
          bookings: bookingsRes.data.length || 0,
          favorites: favoritesRes.data.length || 0,
        });
        setApplication(appRes.data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  const getStatusBadge = (status) => {
    const styles = {
      pending: 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30',
      approved: 'bg-green-500/20 text-green-400 border border-green-500/30',
      rejected: 'bg-red-500/20 text-red-400 border border-red-500/30',
    };
    return styles[status?.toLowerCase()] || 'bg-gray-500/20 text-gray-400 border border-gray-500/30';
  };

  return (
    <div>
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-black text-white">Overview</h1>
        <p className="text-neutral/60 text-sm mt-1">Welcome back, {user?.name}! 👋</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
        <StatCard
          icon="📅"
          label="Total Booked Classes"
          value={stats.bookings}
          color="primary"
        />
        <StatCard
          icon="❤️"
          label="Total Favorites"
          value={stats.favorites}
          color="accent"
        />
      </div>

      {/* Profile Section */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
        <h2 className="text-lg font-bold text-white mb-4">Profile Details</h2>
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-2xl font-bold text-black overflow-hidden flex-shrink-0">
            {user?.image ? (
              <Image
                src={user.image}
                alt={user.name}
                width={64}
                height={64}
                className="object-cover w-full h-full"
              />
            ) : (
              user?.name?.charAt(0).toUpperCase()
            )}
          </div>
          <div className="flex-1">
            <p className="text-xl font-bold text-white">{user?.name}</p>
            <p className="text-neutral/60 text-sm">{user?.email}</p>
          </div>
          <span className="px-4 py-1.5 rounded-full bg-primary/20 text-primary text-xs font-bold uppercase tracking-wider border border-primary/30">
            {user?.role}
          </span>
        </div>

        {/* Trainer Application Status */}
        <div className="mt-6 pt-6 border-t border-white/10">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <span className="text-sm text-neutral/60">Trainer Application Status</span>
            {application ? (
              <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${getStatusBadge(application.status)}`}>
                {application.status}
              </span>
            ) : (
              <span className="text-sm text-neutral/50">Not applied yet</span>
            )}
          </div>
          {application?.status === 'rejected' && application?.feedback && (
            <p className="mt-2 text-sm text-red-400/80 bg-red-500/10 border border-red-500/20 rounded-lg p-3">
              💬 {application.feedback}
            </p>
          )}
          {application?.status === 'pending' && (
            <p className="mt-2 text-sm text-yellow-400/80 bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3">
              ⏳ Your application is being reviewed by the admin. You'll be notified once it's processed.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}