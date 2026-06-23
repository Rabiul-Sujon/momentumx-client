'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from '@/lib/axios';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import Modal from '@/components/ui/Modal';
import toast from 'react-hot-toast';

export default function AppliedTrainersPage() {
  const queryClient = useQueryClient();
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [feedback, setFeedback] = useState('');

  // Fetch pending applications
  const { data: applications, isLoading } = useQuery({
    queryKey: ['admin-applications'],
    queryFn: () => axios.get('/api/trainers/applications').then((r) => r.data),
  });

  // Approve application
  const approveMutation = useMutation({
    mutationFn: ({ id, feedback }) =>
      axios.put(`/api/trainers/approve/${id}`, { feedback }),
    onSuccess: () => {
      toast.success('Trainer application approved!');
      queryClient.invalidateQueries(['admin-applications']);
      setShowModal(false);
      setSelectedApplication(null);
      setFeedback('');
    },
    onError: () => toast.error('Failed to approve application'),
  });

  // Reject application
  const rejectMutation = useMutation({
    mutationFn: ({ id, feedback }) =>
      axios.put(`/api/trainers/reject/${id}`, { feedback }),
    onSuccess: () => {
      toast.success('Trainer application rejected');
      queryClient.invalidateQueries(['admin-applications']);
      setShowModal(false);
      setSelectedApplication(null);
      setFeedback('');
    },
    onError: () => toast.error('Failed to reject application'),
  });

  const openDetails = (app) => {
    setSelectedApplication(app);
    setFeedback(app.feedback || '');
    setShowModal(true);
  };

  const handleApprove = () => {
    if (!feedback.trim()) {
      toast.error('Please provide feedback');
      return;
    }
    approveMutation.mutate({ id: selectedApplication._id, feedback });
  };

  const handleReject = () => {
    if (!feedback.trim()) {
      toast.error('Please provide feedback');
      return;
    }
    rejectMutation.mutate({ id: selectedApplication._id, feedback });
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div>
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-black text-white">Applied Trainers</h1>
        <p className="text-neutral/60 text-sm mt-1">
          {applications?.length > 0
            ? `${applications.length} pending application${applications.length > 1 ? 's' : ''}`
            : 'No pending applications'}
        </p>
      </div>

      {/* Applications Table */}
      {applications?.length > 0 ? (
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
                    Experience
                  </th>
                  <th className="text-left text-xs font-medium text-neutral/60 uppercase tracking-wider px-6 py-4">
                    Specialty
                  </th>
                  <th className="text-right text-xs font-medium text-neutral/60 uppercase tracking-wider px-6 py-4">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {applications.map((app) => (
                  <tr key={app._id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4">
                      <p className="text-white font-medium text-sm">{app.userName}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-neutral/60 text-sm">{app.userEmail}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-white text-sm">{app.experience} years</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 rounded-full text-xs font-bold capitalize bg-primary/10 text-primary border border-primary/30">
                        {app.specialty}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => openDetails(app)}
                        className="px-4 py-2 rounded-lg text-sm font-medium bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                      >
                        Details
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
          <p className="text-5xl mb-4">✅</p>
          <h3 className="text-xl font-bold text-white mb-2">No Pending Applications</h3>
          <p className="text-neutral/60 text-sm">All trainer applications have been reviewed.</p>
        </div>
      )}

      {/* Details Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setSelectedApplication(null);
          setFeedback('');
        }}
        title="Application Details"
      >
        {selectedApplication && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-neutral/60">Name</p>
                <p className="text-white font-medium">{selectedApplication.userName}</p>
              </div>
              <div>
                <p className="text-neutral/60">Email</p>
                <p className="text-white font-medium">{selectedApplication.userEmail}</p>
              </div>
              <div>
                <p className="text-neutral/60">Experience</p>
                <p className="text-white font-medium">{selectedApplication.experience} years</p>
              </div>
              <div>
                <p className="text-neutral/60">Specialty</p>
                <p className="text-white font-medium capitalize">{selectedApplication.specialty}</p>
              </div>
            </div>

            {/* Feedback Input */}
            <div>
              <label className="block text-sm font-medium text-white mb-1.5">
                Feedback *
              </label>
              <textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Provide feedback for this application..."
                rows={3}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-neutral/50 focus:outline-none focus:border-primary transition-colors resize-none"
              />
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <button
                onClick={handleApprove}
                disabled={approveMutation.isPending || rejectMutation.isPending}
                className="flex-1 py-3 rounded-xl font-bold text-black bg-gradient-to-r from-green-400 to-green-600 hover:scale-[1.02] transition-all disabled:opacity-50"
              >
                {approveMutation.isPending ? 'Approving...' : 'Approve'}
              </button>
              <button
                onClick={handleReject}
                disabled={approveMutation.isPending || rejectMutation.isPending}
                className="flex-1 py-3 rounded-xl font-bold text-white bg-gradient-to-r from-red-500 to-red-700 hover:scale-[1.02] transition-all disabled:opacity-50"
              >
                {rejectMutation.isPending ? 'Rejecting...' : 'Reject'}
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}