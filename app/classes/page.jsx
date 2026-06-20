'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from '@/lib/axios';
import Link from 'next/link';
import { motion } from 'framer-motion';

const categories = ['All', 'Yoga', 'Cardio', 'HIIT', 'Strength', 'Pilates', 'Weights', 'Dance', 'Boxing'];

const categoryColors = {
  Yoga: 'text-green-400 bg-green-400/10',
  Cardio: 'text-red-400 bg-red-400/10',
  Strength: 'text-orange-400 bg-orange-400/10',
  HIIT: 'text-yellow-400 bg-yellow-400/10',
  Pilates: 'text-pink-400 bg-pink-400/10',
  Weights: 'text-blue-400 bg-blue-400/10',
  Dance: 'text-purple-400 bg-purple-400/10',
  Boxing: 'text-red-500 bg-red-500/10',
  default: 'text-primary bg-primary/10',
};

const difficultyColors = {
  beginner: 'text-green-400',
  intermediate: 'text-yellow-400',
  advanced: 'text-red-400',
};

export default function ClassesPage() {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [page, setPage] = useState(1);
  const limit = 9;

  const { data, isLoading } = useQuery({
    queryKey: ['classes', search, selectedCategory, page],
    queryFn: async () => {
      const params = { page, limit };
      if (search) params.search = search;
      if (selectedCategory !== 'All') params.category = selectedCategory;
      const res = await axios.get('/api/classes', { params });
      return res.data;
    },
  });

  const classes = data?.classes || [];
  const totalPages = data?.totalPages || 1;

  return (
    <div className="min-h-screen py-16 px-4">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/5 mb-4">
            <span className="text-primary text-xs font-medium tracking-wider uppercase">
              All Classes
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-white mb-4">
            Find Your Perfect{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
              Class
            </span>
          </h1>
          <p className="text-neutral max-w-xl mx-auto">
            Browse our wide range of fitness classes led by expert trainers. Filter by category or search by name.
          </p>
        </motion.div>

        {/* Search & Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-10"
        >
          {/* Search */}
          <div className="relative max-w-xl mx-auto mb-6">
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search classes by name..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="input input-bordered w-full pl-12 bg-base-200 border-base-300 focus:border-primary rounded-xl"
            />
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => { setSelectedCategory(cat); setPage(1); }}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  selectedCategory === cat
                    ? 'bg-primary text-black font-bold'
                    : 'bg-base-200 text-neutral hover:text-white hover:bg-base-300 border border-base-300'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Loading Skeleton */}
        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(9)].map((_, i) => (
              <div key={i} className="bg-base-200 rounded-2xl overflow-hidden animate-pulse">
                <div className="h-48 bg-base-300"></div>
                <div className="p-5 space-y-3">
                  <div className="h-4 bg-base-300 rounded w-3/4"></div>
                  <div className="h-3 bg-base-300 rounded w-1/2"></div>
                  <div className="h-8 bg-base-300 rounded w-full mt-4"></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Classes Grid */}
        {!isLoading && classes.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {classes.map((cls, index) => (
              <motion.div
                key={cls._id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
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

                  {/* Category */}
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
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-white font-bold text-lg truncate flex-1">{cls.name}</h3>
                  </div>

                  <p className="text-neutral text-sm mb-1">by {cls.trainerName}</p>

                  <p className={`text-xs font-semibold capitalize mb-3 ${difficultyColors[cls.difficultyLevel]}`}>
                    {cls.difficultyLevel}
                  </p>

                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-1 text-neutral text-xs">
                      <span>⏱️</span>
                      <span>{cls.duration} mins</span>
                    </div>
                    <p className="text-primary font-black text-xl">${cls.price}</p>
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
        {!isLoading && classes.length === 0 && (
          <div className="text-center py-20">
            <p className="text-6xl mb-4">🏋️</p>
            <h3 className="text-white font-bold text-xl mb-2">No Classes Found</h3>
            <p className="text-neutral">Try adjusting your search or filter criteria.</p>
            <button
              onClick={() => { setSearch(''); setSelectedCategory('All'); setPage(1); }}
              className="btn btn-primary text-black font-bold rounded-full px-8 mt-6"
            >
              Clear Filters
            </button>
          </div>
        )}

        {/* Pagination */}
        {!isLoading && totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-12">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="btn btn-outline btn-sm rounded-xl border-base-300 hover:border-primary hover:text-primary disabled:opacity-30"
            >
              ← Prev
            </button>

            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i + 1)}
                className={`btn btn-sm rounded-xl ${
                  page === i + 1
                    ? 'btn-primary text-black font-bold'
                    : 'btn-outline border-base-300 hover:border-primary hover:text-primary'
                }`}
              >
                {i + 1}
              </button>
            ))}

            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="btn btn-outline btn-sm rounded-xl border-base-300 hover:border-primary hover:text-primary disabled:opacity-30"
            >
              Next →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}