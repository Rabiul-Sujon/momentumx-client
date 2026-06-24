'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from '@/lib/axios';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import Modal from '@/components/ui/Modal';
import toast from 'react-hot-toast';
import Link from 'next/link';

export default function MyClassesPage() {
  const queryClient = useQueryClient();
  const [selectedClass, setSelectedClass] = useState(null);
  const [showStudentsModal, setShowStudentsModal] = useState(false);
  const [students, setStudents] = useState([]);
  const [loadingStudents, setLoadingStudents] = useState(false);

  // Fetch trainer's classes
  const { data: classes, isLoading } = useQuery({
    queryKey: ['trainer-classes'],
    queryFn: () => axios.get('/api/classes/trainer').then((r) => r.data),
  });

  // Delete class mutation
  const deleteMutation = useMutation({
    mutationFn: (classId) => axios.delete(`/api/classes/${classId}`),
    onSuccess: () => {
      toast.success('Class deleted successfully!');
      queryClient.invalidateQueries(['trainer-classes']);
    },
    onError: () => toast.error('Failed to delete class'),
  });

  // Update class mutation (set status to pending)
  const updateMutation = useMutation({
    mutationFn: ({ classId, data }) =>
      axios.put(`/api/classes/${classId}`, data),
    onSuccess: () => {
      toast.success('Class updated! Status set to pending for review.');
      queryClient.invalidateQueries(['trainer-classes']);
    },
    onError: () => toast.error('Failed to update class'),
  });

  const handleDelete = (classId) => {
    if (confirm('Are you sure you want to delete this class?')) {
      deleteMutation.mutate(classId);
    }
  };

  const handleUpdate = (classId) => {
    // Open edit modal or redirect to edit page
    // For now, just set status to pending
    updateMutation.mutate({ classId, data: { status: 'pending' } });
  };

  const handleViewStudents = async (classId) => {
    setLoadingStudents(true);
    try {
      const response = await axios.get(`/api/bookings/students/${classId}`);
      setStudents(response.data);
      setShowStudentsModal(true);
    } catch (error) {
      toast.error('Failed to fetch students');
    } finally {
      setLoadingStudents(false);
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
        <h1 className="text-2xl md:text-3xl font-black text-white">My Classes</h1>
        <p className="text-neutral/60 text-sm mt-1">
          {classes?.length > 0
            ? `You have created ${classes.length} class${classes.length > 1 ? 'es' : ''}`
            : "You haven't created any classes yet"}
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
                    Category
                  </th>
                  <th className="text-left text-xs font-medium text-neutral/60 uppercase tracking-wider px-6 py-4">
                    Price
                  </th>
                  <th className="text-left text-xs font-medium text-neutral/60 uppercase tracking-wider px-6 py-4">
                    Status
                  </th>
                  <th className="text-left text-xs font-medium text-neutral/60 uppercase tracking-wider px-6 py-4">
                    Bookings
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
                      <span className="text-neutral/60 text-sm capitalize">{cls.category}</span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-primary font-bold">${cls.price}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${getStatusBadge(cls.status)}`}>
                        {cls.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-white text-sm font-medium">{cls.bookingCount || 0}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2 flex-wrap">
                        <button
                          onClick={() => handleViewStudents(cls._id)}
                          className="px-3 py-1.5 rounded-lg text-xs font-medium bg-accent/10 text-accent hover:bg-accent/20 transition-colors"
                        >
                          View Students
                        </button>
                        <button
                         onClick={() => setSelectedClass(cls)}
                          className="px-3 py-1.5 rounded-lg text-xs font-medium bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                          >
                         Update
                        </button>
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
          <h3 className="text-xl font-bold text-white mb-2">No Classes Created</h3>
          <p className="text-neutral/60 text-sm">
            Create your first class and start teaching!
          </p>
          <Link
            href="/dashboard/trainer/add-class"
            className="inline-block mt-4 px-6 py-2 bg-gradient-to-r from-primary to-accent rounded-full text-black font-bold text-sm hover:scale-105 transition-transform"
          >
            Add Class →
          </Link>
        </div>
      )}

      {/* Students Modal */}
      <Modal
        isOpen={showStudentsModal}
        onClose={() => setShowStudentsModal(false)}
        title="Enrolled Students"
      >
        {loadingStudents ? (
          <div className="flex justify-center py-8">
            <span className="loading loading-spinner loading-lg text-primary"></span>
          </div>
        ) : students.length > 0 ? (
          <div className="space-y-3">
            {students.map((student) => (
              <div
                key={student._id}
                className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10"
              >
                <div>
                  <p className="text-white font-medium text-sm">{student.userName}</p>
                  <p className="text-neutral/60 text-xs">{student.userEmail}</p>
                </div>
                <span className="text-neutral/40 text-xs">
                  {new Date(student.createdAt).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-neutral/60 py-8">No students enrolled yet.</p>
        )}
      </Modal>

      {/* Update Modal */}
<Modal
  isOpen={!!selectedClass}
  onClose={() => setSelectedClass(null)}
  title="Update Class"
>
  {selectedClass && (
    <form onSubmit={(e) => {
      e.preventDefault();
      const formData = new FormData(e.target);
      updateMutation.mutate({
        classId: selectedClass._id,
        data: {
          name: formData.get('name'),
          price: formData.get('price'),
          description: formData.get('description'),
        }
      });
      setSelectedClass(null);
    }} className="space-y-4">
      <div>
        <label className="text-sm text-neutral/60 mb-1 block">Class Name</label>
        <input
          name="name"
          defaultValue={selectedClass.name}
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white text-sm outline-none focus:border-primary"
        />
      </div>
      <div>
        <label className="text-sm text-neutral/60 mb-1 block">Price ($)</label>
        <input
          name="price"
          type="number"
          defaultValue={selectedClass.price}
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white text-sm outline-none focus:border-primary"
        />
      </div>
      <div>
        <label className="text-sm text-neutral/60 mb-1 block">Description</label>
        <textarea
          name="description"
          defaultValue={selectedClass.description}
          rows={3}
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white text-sm outline-none focus:border-primary resize-none"
        />
      </div>
      <button
        type="submit"
        className="w-full py-2.5 rounded-xl text-black font-bold text-sm"
        style={{ background: 'linear-gradient(135deg, #00D4FF, #7B2FFF)' }}
      >
        Update Class
      </button>
    </form>
  )}
</Modal>
    </div>
  );
}