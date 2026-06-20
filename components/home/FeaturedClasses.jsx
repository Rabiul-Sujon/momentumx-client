'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import axios from '@/lib/axios';

const categoryColors = {
  Yoga: 'text-green-400 bg-green-400/10',
  Cardio: 'text-red-400 bg-red-400/10',
  Strength: 'text-orange-400 bg-orange-400/10',
  HIIT: 'text-yellow-400 bg-yellow-400/10',
  Pilates: 'text-pink-400 bg-pink-400/10',
  Weights: 'text-blue-400 bg-blue-400/10',
  default: 'text-primary bg-primary/10',
};

export default function FeaturedClasses() {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedClasses = async () => {
      try {
        const res = await axios.get('/api/classes/featured');
        setClasses(res.data);
      } catch (error) {
        console.error('Error fetching featured classes:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchFeaturedClasses();
  }, []);

  return (
    <section className="py-24 relative">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-base-200/30 to-transparent"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/5 mb-4">
            <span className="text-primary text-xs font-medium tracking-wider uppercase">
              Top Picks
            </span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-black text-white mb-4">
            Featured <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Classes</span>
          </h2>
          <p className="text-neutral max-w-xl mx-auto">
            Our most popular fitness classes handpicked based on member bookings and trainer expertise.
          </p>
        </motion.div>

        {/* Loading */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-base-200 rounded-2xl overflow-hidden animate-pulse">
                <div className="h-48 bg-base-300"></div>
                <div className="p-5 space-y-3">
                  <div className="h-4 bg-base-300 rounded w-3/4"></div>
                  <div className="h-3 bg-base-300 rounded w-1/2"></div>
                  <div className="h-3 bg-base-300 rounded w-2/3"></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Classes Grid */}
        {!loading && classes.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {classes.map((cls, index) => (
              <motion.div
                key={cls._id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group bg-base-200 border border-base-300 hover:border-primary/30 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1"
              >
                {/* Image */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={cls.image}
                    alt={cls.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-base-200 via-transparent to-transparent"></div>

                  {/* Category Badge */}
                  <div className="absolute top-3 left-3">
                    <span className={`text-xs font-bold px-3 py-1 rounded-full ${categoryColors[cls.category] || categoryColors.default}`}>
                      {cls.category}
                    </span>
                  </div>

                  {/* Booking Count */}
                  <div className="absolute top-3 right-3 flex items-center gap-1 bg-base-100/80 backdrop-blur-sm rounded-full px-2 py-1">
                    <span className="text-xs">🔥</span>
                    <span className="text-white text-xs font-bold">{cls.bookingCount}</span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  <h3 className="text-white font-bold text-lg mb-1 truncate">{cls.name}</h3>
                  <p className="text-neutral text-sm mb-3">by {cls.trainerName}</p>

                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-1 text-neutral text-xs">
                      <span>⏱️</span>
                      <span>{cls.duration} mins</span>
                    </div>
                    <p className="text-primary font-black text-lg">${cls.price}</p>
                  </div>

                  <Link
                    href={`/classes/${cls._id}`}
                    className="btn btn-outline btn-sm w-full rounded-xl border-base-300 hover:border-primary hover:text-primary hover:bg-transparent transition-all"
                  >
                    View Details
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && classes.length === 0 && (
          <div className="text-center py-20">
            <p className="text-4xl mb-4">🏋️</p>
            <p className="text-neutral">No featured classes available yet.</p>
          </div>
        )}

        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mt-12"
        >
          <Link
            href="/classes"
            className="btn btn-primary text-black font-bold rounded-full px-10"
          >
            View All Classes
          </Link>
        </motion.div>
      </div>
    </section>
  );
}