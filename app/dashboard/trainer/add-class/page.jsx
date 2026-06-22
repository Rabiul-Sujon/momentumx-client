'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from '@/lib/axios';
import toast from 'react-hot-toast';

export default function AddClassPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    image: '',
    category: '',
    difficultyLevel: '',
    duration: '',
    schedule: { days: [], time: '' },
    price: '',
    description: '',
  });

  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleDayToggle = (day) => {
    setFormData((prev) => {
      const days = prev.schedule.days.includes(day)
        ? prev.schedule.days.filter((d) => d !== day)
        : [...prev.schedule.days, day];
      return { ...prev, schedule: { ...prev.schedule, days } };
    });
  };

  const handleScheduleTime = (e) => {
    setFormData({
      ...formData,
      schedule: { ...formData.schedule, time: e.target.value },
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post('/api/classes', formData);
      toast.success('Class added successfully! Status: Pending');
      router.push('/dashboard/trainer/my-classes');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add class');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-black text-white">Add New Class</h1>
        <p className="text-neutral/60 text-sm mt-1">
          Fill out the form below to create a new fitness class
        </p>
      </div>

      {/* Form */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Class Name */}
          <div>
            <label className="block text-sm font-medium text-white mb-1.5">
              Class Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g., Advanced Weight Training"
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

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-white mb-1.5">
              Category *
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-primary transition-colors"
            >
              <option value="" className="bg-[#0A0F1E]">Select category</option>
              <option value="yoga" className="bg-[#0A0F1E]">Yoga</option>
              <option value="weights" className="bg-[#0A0F1E]">Weights</option>
              <option value="cardio" className="bg-[#0A0F1E]">Cardio</option>
              <option value="pilates" className="bg-[#0A0F1E]">Pilates</option>
              <option value="crossfit" className="bg-[#0A0F1E]">CrossFit</option>
              <option value="dance" className="bg-[#0A0F1E]">Dance</option>
              <option value="boxing" className="bg-[#0A0F1E]">Boxing</option>
            </select>
          </div>

          {/* Difficulty Level */}
          <div>
            <label className="block text-sm font-medium text-white mb-1.5">
              Difficulty Level *
            </label>
            <select
              name="difficultyLevel"
              value={formData.difficultyLevel}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-primary transition-colors"
            >
              <option value="" className="bg-[#0A0F1E]">Select difficulty</option>
              <option value="beginner" className="bg-[#0A0F1E]">Beginner</option>
              <option value="intermediate" className="bg-[#0A0F1E]">Intermediate</option>
              <option value="advanced" className="bg-[#0A0F1E]">Advanced</option>
            </select>
          </div>

          {/* Duration */}
          <div>
            <label className="block text-sm font-medium text-white mb-1.5">
              Duration (minutes) *
            </label>
            <input
              type="number"
              name="duration"
              value={formData.duration}
              onChange={handleChange}
              placeholder="e.g., 45"
              required
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-neutral/50 focus:outline-none focus:border-primary transition-colors"
            />
          </div>

          {/* Schedule */}
          <div>
            <label className="block text-sm font-medium text-white mb-1.5">
              Schedule *
            </label>
            <div className="flex flex-wrap gap-2 mb-3">
              {daysOfWeek.map((day) => (
                <button
                  key={day}
                  type="button"
                  onClick={() => handleDayToggle(day)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                    formData.schedule.days.includes(day)
                      ? 'bg-primary text-black'
                      : 'bg-white/5 text-neutral hover:bg-white/10'
                  }`}
                >
                  {day}
                </button>
              ))}
            </div>
            <input
              type="time"
              value={formData.schedule.time}
              onChange={handleScheduleTime}
              required
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-primary transition-colors"
            />
          </div>

          {/* Price */}
          <div>
            <label className="block text-sm font-medium text-white mb-1.5">
              Price ($) *
            </label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              placeholder="e.g., 25"
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
              placeholder="Describe your class..."
              rows={4}
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
                Adding Class...
              </span>
            ) : (
              'Add Class'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}