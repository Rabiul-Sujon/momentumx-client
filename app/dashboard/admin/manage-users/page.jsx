'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from '@/lib/axios';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import toast from 'react-hot-toast';

export default function ManageUsersPage() {
  const queryClient = useQueryClient();

  // Fetch all users
  const { data: users, isLoading } = useQuery({
    queryKey: ['admin-users'],
    queryFn: () => axios.get('/api/users/all').then((r) => r.data),
  });

  // Block/Unblock user
  const statusMutation = useMutation({
    mutationFn: ({ userId, status }) =>
      axios.put(`/api/users/status/${userId}`, { status }),
    onSuccess: () => {
      toast.success('User status updated!');
      queryClient.invalidateQueries(['admin-users']);
    },
    onError: () => toast.error('Failed to update user status'),
  });

  // Make Admin
  const makeAdminMutation = useMutation({
    mutationFn: (userId) => axios.put(`/api/users/make-admin/${userId}`),
    onSuccess: () => {
      toast.success('User promoted to Admin!');
      queryClient.invalidateQueries(['admin-users']);
    },
    onError: () => toast.error('Failed to promote user'),
  });

  const handleToggleStatus = (userId, currentStatus) => {
    const newStatus = currentStatus === 'active' ? 'blocked' : 'active';
    if (confirm(`Are you sure you want to ${newStatus} this user?`)) {
      statusMutation.mutate({ userId, status: newStatus });
    }
  };

  const handleMakeAdmin = (userId) => {
    if (confirm('Are you sure you want to make this user an Admin?')) {
      makeAdminMutation.mutate(userId);
    }
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div>
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-black text-white">Manage Users</h1>
        <p className="text-neutral/60 text-sm mt-1">
          {users?.length > 0
            ? `Total ${users.length} registered users`
            : 'No users found'}
        </p>
      </div>

      {/* Users Table */}
      {users?.length > 0 ? (
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
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {users.map((user) => (
                  <tr key={user._id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4">
                      <p className="text-white font-medium text-sm">{user.name}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-neutral/60 text-sm">{user.email}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                        user.role === 'admin'
                          ? 'bg-accent/20 text-accent border border-accent/30'
                          : user.role === 'trainer'
                          ? 'bg-primary/20 text-primary border border-primary/30'
                          : 'bg-gray-500/20 text-gray-400 border border-gray-500/30'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                        user.status === 'active'
                          ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                          : 'bg-red-500/20 text-red-400 border border-red-500/30'
                      }`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2 flex-wrap">
                        <button
                          onClick={() => handleToggleStatus(user._id, user.status)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                            user.status === 'active'
                              ? 'bg-red-500/10 text-red-400 hover:bg-red-500/20'
                              : 'bg-green-500/10 text-green-400 hover:bg-green-500/20'
                          }`}
                        >
                          {user.status === 'active' ? 'Block' : 'Unblock'}
                        </button>
                        {user.role !== 'admin' && (
                          <button
                            onClick={() => handleMakeAdmin(user._id)}
                            className="px-3 py-1.5 rounded-lg text-xs font-medium bg-accent/10 text-accent hover:bg-accent/20 transition-colors"
                          >
                            Make Admin
                          </button>
                        )}
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
          <p className="text-5xl mb-4">👥</p>
          <h3 className="text-xl font-bold text-white mb-2">No Users</h3>
          <p className="text-neutral/60 text-sm">No registered users yet.</p>
        </div>
      )}
    </div>
  );
}