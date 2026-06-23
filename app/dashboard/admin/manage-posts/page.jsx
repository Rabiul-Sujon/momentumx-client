'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from '@/lib/axios';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import toast from 'react-hot-toast';
import Link from 'next/link';

export default function ManageForumPostsPage() {
  const queryClient = useQueryClient();

  // Fetch all forum posts
  const { data: posts, isLoading } = useQuery({
    queryKey: ['admin-forum-posts'],
    queryFn: () => axios.get('/api/forum/admin').then((r) => r.data),
  });

  // Delete post
  const deleteMutation = useMutation({
    mutationFn: (postId) => axios.delete(`/api/forum/${postId}`),
    onSuccess: () => {
      toast.success('Post deleted successfully!');
      queryClient.invalidateQueries(['admin-forum-posts']);
    },
    onError: () => toast.error('Failed to delete post'),
  });

  const handleDelete = (postId) => {
    if (confirm('Are you sure you want to delete this post?')) {
      deleteMutation.mutate(postId);
    }
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div>
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-black text-white">Manage Forum Posts</h1>
        <p className="text-neutral/60 text-sm mt-1">
          {posts?.length > 0
            ? `Total ${posts.length} post${posts.length > 1 ? 's' : ''}`
            : 'No forum posts found'}
        </p>
      </div>

      {/* Posts Table */}
      {posts?.length > 0 ? (
        <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white/5 border-b border-white/10">
                <tr>
                  <th className="text-left text-xs font-medium text-neutral/60 uppercase tracking-wider px-6 py-4">
                    Title
                  </th>
                  <th className="text-left text-xs font-medium text-neutral/60 uppercase tracking-wider px-6 py-4">
                    Author
                  </th>
                  <th className="text-left text-xs font-medium text-neutral/60 uppercase tracking-wider px-6 py-4">
                    Role
                  </th>
                  <th className="text-left text-xs font-medium text-neutral/60 uppercase tracking-wider px-6 py-4">
                    Likes
                  </th>
                  <th className="text-left text-xs font-medium text-neutral/60 uppercase tracking-wider px-6 py-4">
                    Comments
                  </th>
                  <th className="text-right text-xs font-medium text-neutral/60 uppercase tracking-wider px-6 py-4">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {posts.map((post) => (
                  <tr key={post._id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4">
                      <Link
                        href={`/forum/${post._id}`}
                        className="text-white font-medium text-sm hover:text-primary transition-colors"
                      >
                        {post.title}
                      </Link>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-neutral/60 text-sm">{post.authorName}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                        post.authorRole === 'admin'
                          ? 'bg-accent/20 text-accent border border-accent/30'
                          : 'bg-primary/20 text-primary border border-primary/30'
                      }`}>
                        {post.authorRole}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-white text-sm">{post.likes?.length || 0}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-white text-sm">{post.comments?.length || 0}</p>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleDelete(post._id)}
                        disabled={deleteMutation.isPending}
                        className="px-4 py-2 rounded-lg text-sm font-medium bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors disabled:opacity-50"
                      >
                        Delete
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
          <p className="text-5xl mb-4">📝</p>
          <h3 className="text-xl font-bold text-white mb-2">No Forum Posts</h3>
          <p className="text-neutral/60 text-sm">No forum posts have been created yet.</p>
        </div>
      )}
    </div>
  );
}