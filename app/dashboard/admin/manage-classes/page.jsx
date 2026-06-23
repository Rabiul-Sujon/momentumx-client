'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from '@/lib/axios';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import toast from 'react-hot-toast';

export default function ManageClassesPage() {
  const queryClient = useQueryClient();

  // Fetch all classes
  const { data: classes, isLoading } = useQuery({
    queryKey: ['admin-classes'],
    queryFn: () => axios.get('/api/classes/admin').then((r) => r.data),
  });

  // Approve class
  const approveMutation = useMutation({
    mutationFn: (classId) =>
      axios.put(`/api/classes/${classId}/status`, { status: 'approved' }),
    onSuccess: () => {
      toast.success('Class approved successfully!');
      queryClient.invalidateQueries(['admin-classes']);
    },
    onError: () => toast.error('Failed to approve class'),
  });

  // Reject class
  const rejectMutation = useMutation({
    mutationFn: (classId) =>
      axios.put(`/api/classes/${classId}/status`, { status: 'rejected' }),
    onSuccess: () => {
      toast.success('Class rejected');
      queryClient.invalidateQueries(['admin-classes']);
    },
    onError: () => toast.error('Failed to reject class'),
  });

  // Delete class
  const deleteMutation = useMutation({
    mutationFn: (classId) => axios.delete(`/api/classes/${classId}`),
    onSuccess: () => {
      toast.success('Class deleted successfully!');
      queryClient.invalidateQueries(['admin-classes']);
    },
    onError: () => toast.error('Failed to delete class'),
  });

  const handleApprove = (classId) => {
    if (confirm('Approve this class?')) {
      approveMutation.mutate(classId);
    }
  };

  const handleReject = (classId) => {
    if (confirm('Reject this class?')) {
      rejectMutation.mutate(classId);
    }
  };

  const handleDelete = (classId) => {
    if (confirm('Are you sure you want to delete this class?')) {
      deleteMutation.mutate(classId);
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      pending: 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30',
      approved: 'bg-green-500/20 text-green-400 border border-green-500/30',
      rejected: 'bg-red-500/20 text-red-400 border border-red-500/30',
    };
    return styles[status?.toLowerCase()] || 'bg-gray-500/20 text-gray-400 border border-gray-500/30';
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div>
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-black text-white">Manage Classes</h1>
        <p className="text-neutral/60 text-sm mt-1">
          {classes?.length > 0
            ? `Total ${classes.length} classes`
            : 'No classes found'}
        </p>
      </div>

      {/* Classes Table */}
      {classes?.length > 0 ? (
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
                    Category
                  </th>
                  <th className="text-left text-xs font-medium text-neutral/60 uppercase tracking-wider px-6 py-4">
                    Status
                  </th>
                  <th className="text-right text-xs font-medium text-neutral/60 uppercase tracking-wider px-6 py-4">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {classes.map((cls) => (
                  <tr key={cls._id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4">
                      <p className="text-white font-medium text-sm">{cls.name}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-neutral/60 text-sm">{cls.trainerName}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-neutral/60 text-sm capitalize">{cls.category}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${getStatusBadge(cls.status)}`}>
                        {cls.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2 flex-wrap">
                        {cls.status !== 'approved' && (
                          <button
                            onClick={() => handleApprove(cls._id)}
                            className="px-3 py-1.5 rounded-lg text-xs font-medium bg-green-500/10 text-green-400 hover:bg-green-500/20 transition-colors"
                          >
                            Approve
                          </button>
                        )}
                        {cls.status !== 'rejected' && (
                          <button
                            onClick={() => handleReject(cls._id)}
                            className="px-3 py-1.5 rounded-lg text-xs font-medium bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
                          >
                            Reject
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(cls._id)}
                          className="px-3 py-1.5 rounded-lg text-xs font-medium bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="text-center py-16 bg-white/5 border border-white/10 rounded-2xl">
          <p className="text-5xl mb-4">📚</p>
          <h3 className="text-xl font-bold text-white mb-2">No Classes</h3>
          <p className="text-neutral/60 text-sm">No classes have been created yet.</p>
        </div>
      )}
    </div>
  );
}