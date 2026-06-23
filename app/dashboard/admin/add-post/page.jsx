'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from '@/lib/axios';
import toast from 'react-hot-toast';

export default function AddForumPostPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    image: '',
    description: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post('/api/forum', formData);
      toast.success('Forum post created successfully!');
      router.push('/dashboard/admin/manage-posts');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-black text-white">Add Forum Post</h1>
        <p className="text-neutral/60 text-sm mt-1">
          Share knowledge and announcements with the community
        </p>
      </div>

      {/* Form */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-white mb-1.5">
              Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter post title"
              required
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-neutral/50 focus:outline-none focus:border-primary transition-colors"
            />
          </div>

          {/* Image URL */}
          <div>
            <label className="block text-sm font-medium text-white mb-1.5">
              Image URL *
            </label>
            <input
              type="url"
              name="image"
              value={formData.image}
              onChange={handleChange}
              placeholder="https://images.unsplash.com/..."
              required
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-neutral/50 focus:outline-none focus:border-primary transition-colors"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-white mb-1.5">
              Description *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Write your post content here..."
              rows={6}
              required
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-neutral/50 focus:outline-none focus:border-primary transition-colors resize-none"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-primary to-accent rounded-xl font-bold text-black hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                Publishing...
              </span>
            ) : (
              'Publish Post'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}