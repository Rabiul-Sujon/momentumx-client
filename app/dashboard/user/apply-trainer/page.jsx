'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from '@/lib/axios';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import toast from 'react-hot-toast';

export default function ApplyTrainerPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [applicationStatus, setApplicationStatus] = useState(null);

  const [formData, setFormData] = useState({
    experience: '',
    specialty: '',
  });

  useEffect(() => {
    const checkStatus = async () => {
      setLoading(true);
      try {
        const response = await axios.get('/api/trainers/application-status');
        setApplicationStatus(response.data);
      } catch (error) {
        console.error('Error checking application status:', error);
      } finally {
        setLoading(false);
      }
    };
    checkStatus();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await axios.post('/api/trainers/apply', formData);
      toast.success('Application submitted successfully!');
      setApplicationStatus({ status: 'pending' });
      setFormData({ experience: '', specialty: '' });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit application');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  // If already applied
  if (applicationStatus) {
    const status = applicationStatus.status?.toLowerCase();
    const statusConfigs = {
      pending: {
        icon: '⏳',
        title: 'Application Pending',
        message: 'Your application is being reviewed by the admin. You will be notified once it is processed.',
        color: 'text-yellow-400',
        bg: 'bg-yellow-500/10',
        border: 'border-yellow-500/20',
      },
      approved: {
        icon: '✅',
        title: 'Application Approved!',
        message: 'Congratulations! You are now a trainer. You can now create and manage classes.',
        color: 'text-green-400',
        bg: 'bg-green-500/10',
        border: 'border-green-500/20',
      },
      rejected: {
        icon: '❌',
        title: 'Application Rejected',
        message: applicationStatus.feedback || 'Your application was not approved at this time.',
        color: 'text-red-400',
        bg: 'bg-red-500/10',
        border: 'border-red-500/20',
      },
    };

    const config = statusConfigs[status] || statusConfigs.pending;

    return (
      <div>
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-black text-white">Apply as Trainer</h1>
          <p className="text-neutral/60 text-sm mt-1">Your trainer application status</p>
        </div>

        <div className={`${config.bg} border ${config.border} rounded-2xl p-8 text-center`}>
          <p className="text-5xl mb-4">{config.icon}</p>
          <h3 className={`text-xl font-bold ${config.color} mb-2`}>{config.title}</h3>
          <p className="text-neutral/60 text-sm max-w-md mx-auto">{config.message}</p>

          {status === 'rejected' && (
            <button
              onClick={() => {
                setApplicationStatus(null);
                setFormData({ experience: '', specialty: '' });
              }}
              className="mt-6 px-6 py-2 bg-gradient-to-r from-primary to-accent rounded-full text-black font-bold text-sm hover:scale-105 transition-transform"
            >
              Apply Again
            </button>
          )}
        </div>
      </div>
    );
  }

  // Apply form
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-black text-white">Apply as Trainer</h1>
        <p className="text-neutral/60 text-sm mt-1">
          Fill out the form below to apply as a trainer on MomentumX
        </p>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Experience */}
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Years of Experience *
            </label>
            <input
              type="number"
              min="0"
              step="0.5"
              required
              value={formData.experience}
              onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-neutral/50 focus:outline-none focus:border-primary transition-colors"
              placeholder="e.g., 3"
            />
          </div>

          {/* Specialty */}
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Specialty *
            </label>
            <select
              required
              value={formData.specialty}
              onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-primary transition-colors"
            >
              <option value="" className="bg-[#0A0F1E]">Select your specialty</option>
              <option value="yoga" className="bg-[#0A0F1E]">Yoga</option>
              <option value="weights" className="bg-[#0A0F1E]">Weights</option>
              <option value="cardio" className="bg-[#0A0F1E]">Cardio</option>
              <option value="pilates" className="bg-[#0A0F1E]">Pilates</option>
              <option value="crossfit" className="bg-[#0A0F1E]">CrossFit</option>
              <option value="nutrition" className="bg-[#0A0F1E]">Nutrition</option>
              <option value="rehabilitation" className="bg-[#0A0F1E]">Rehabilitation</option>
              <option value="other" className="bg-[#0A0F1E]">Other</option>
            </select>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 bg-gradient-to-r from-primary to-accent rounded-xl font-bold text-black hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                Submitting...
              </span>
            ) : (
              'Submit Application'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}