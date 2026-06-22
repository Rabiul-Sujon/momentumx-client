'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/providers/AuthProvider';
import axios from '@/lib/axios';
import StatCard from '@/components/dashboard/StatCard';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import Image from 'next/image';

export default function TrainerDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ totalClasses: 0, totalStudents: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get('/api/trainers/stats');
        setStats({
          totalClasses: response.data.totalClasses || 0,
          totalStudents: response.data.totalStudents || 0,
        });
      } catch (error) {
        console.error('Error fetching trainer stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

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
          icon="📚"
          label="Total Classes Created"
          value={stats.totalClasses}
          color="primary"
        />
        <StatCard
          icon="👨‍🎓"
          label="Total Students Enrolled"
          value={stats.totalStudents}
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
          <span className="px-4 py-1.5 rounded-full bg-accent/20 text-accent text-xs font-bold uppercase tracking-wider border border-accent/30">
            Trainer
          </span>
        </div>
      </div>
    </div>
  );
}