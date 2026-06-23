'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from '@/lib/axios';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import toast from 'react-hot-toast';

export default function ManageTrainersPage() {
  const queryClient = useQueryClient();

  // Fetch all trainers
  const { data: trainers, isLoading } = useQuery({
    queryKey: ['admin-trainers'],
    queryFn: () => axios.get('/api/trainers/all').then((r) => r.data),
  });

  // Demote trainer
  const demoteMutation = useMutation({
    mutationFn: (userId) => axios.put(`/api/trainers/demote/${userId}`),
    onSuccess: () => {
      toast.success('Trainer demoted to User successfully!');
      queryClient.invalidateQueries(['admin-trainers']);
    },
    onError: () => toast.error('Failed to demote trainer'),
  });

  const handleDemote = (userId, userName) => {
    if (confirm(`Are you sure you want to demote ${userName} back to User?`)) {
      demoteMutation.mutate(userId);
    }
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div>
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-black text-white">Manage Trainers</h1>
        <p className="text-neutral/60 text-sm mt-1">
          {trainers?.length > 0
            ? `${trainers.length} active trainer${trainers.length > 1 ? 's' : ''}`
            : 'No trainers found'}
        </p>
      </div>

      {/* Trainers Table */}
      {trainers?.length > 0 ? (
        <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white/5 border-b border-white/10">
                <tr>
                  <th className="text-left text-xs font-medium text-neutral/60 uppercase tracking-wider px-6 py-4">
                    Name
                  </th>
                  <th className="text-left text-xs font-medium text-neutral/60 uppercase tracking-wider px-6 py-4">
                    Email
                  </th>
                  <th className="text-left text-xs font-medium text-neutral/60 uppercase tracking-wider px-6 py-4">
                    Role
                  </th>
                  <th className="text-left text-xs font-medium text-neutral/60 uppercase tracking-wider px-6 py-4">
                    Status
                  </th>
                  <th className="text-right text-xs font-medium text-neutral/60 uppercase tracking-wider px-6 py-4">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {trainers.map((trainer) => (
                  <tr key={trainer._id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4">
                      <p className="text-white font-medium text-sm">{trainer.name}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-neutral/60 text-sm">{trainer.email}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-primary/20 text-primary border border-primary/30">
                        {trainer.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                        trainer.status === 'active'
                          ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                          : 'bg-red-500/20 text-red-400 border border-red-500/30'
                      }`}>
                        {trainer.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleDemote(trainer._id, trainer.name)}
                        disabled={demoteMutation.isPending}
                        className="px-4 py-2 rounded-lg text-sm font-medium bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors disabled:opacity-50"
                      >
                        Demote to User
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="text-center py-16 bg-white/5 border border-white/10 rounded-2xl">
          <p className="text-5xl mb-4">👨‍🏫</p>
          <h3 className="text-xl font-bold text-white mb-2">No Trainers Found</h3>
          <p className="text-neutral/60 text-sm">There are no active trainers on the platform.</p>
        </div>
      )}
    </div>
  );
}