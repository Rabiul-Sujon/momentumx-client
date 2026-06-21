'use client';

import { useState, useEffect } from 'react';
import axios from '@/lib/axios';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import Link from 'next/link';

export default function BookedClassesPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axios.get('/api/bookings/my-bookings');
        setBookings(response.data);
      } catch (error) {
        console.error('Error fetching bookings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div>
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-black text-white">Booked Classes</h1>
        <p className="text-neutral/60 text-sm mt-1">
          {bookings.length > 0 
            ? `You have booked ${bookings.length} class${bookings.length > 1 ? 'es' : ''}`
            : "You haven't booked any classes yet"}
        </p>
      </div>

      {/* Bookings Table */}
      {bookings.length > 0 ? (
        <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white/5 border-b border-white/10">
                <tr>
                  <th className="text-left text-xs font-medium text-neutral/60 uppercase tracking-wider px-6 py-4">
                    Class Name
                  </th>
                  <th className="text-left text-xs font-medium text-neutral/60 uppercase tracking-wider px-6 py-4">
                    Trainer
                  </th>
                  <th className="text-left text-xs font-medium text-neutral/60 uppercase tracking-wider px-6 py-4">
                    Schedule
                  </th>
                  <th className="text-right text-xs font-medium text-neutral/60 uppercase tracking-wider px-6 py-4">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {bookings.map((booking) => (
                  <tr key={booking._id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4">
                      <p className="text-white font-medium text-sm">
                        {booking.classId?.className || 'Unknown Class'}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-neutral/60 text-sm">
                        {booking.classId?.trainerName || 'Unknown Trainer'}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-neutral/60 text-sm">
                        {booking.classId?.schedule || 'N/A'}
                      </p>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        href={`/classes/${booking.classId?._id}`}
                        className="text-primary hover:text-accent text-sm font-medium transition-colors"
                      >
                        View Details →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="text-center py-16 bg-white/5 border border-white/10 rounded-2xl">
          <p className="text-5xl mb-4">📭</p>
          <h3 className="text-xl font-bold text-white mb-2">No Booked Classes</h3>
          <p className="text-neutral/60 text-sm">
            Explore classes and book your first session!
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
