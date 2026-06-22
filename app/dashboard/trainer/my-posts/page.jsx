'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from '@/lib/axios';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function MyForumPostsPage() {
  const queryClient = useQueryClient();

  // Fetch trainer's posts
  const { data: posts, isLoading } = useQuery({
    queryKey: ['trainer-posts'],
    queryFn: () => axios.get('/api/forum/my-posts').then((r) => r.data),
  });

  // Delete post mutation
  const deleteMutation = useMutation({
    mutationFn: (postId) => axios.delete(`/api/forum/${postId}`),
    onSuccess: () => {
      toast.success('Post deleted successfully!');
      queryClient.invalidateQueries(['trainer-posts']);
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
        <h1 className="text-2xl md:text-3xl font-black text-white">My Forum Posts</h1>
        <p className="text-neutral/60 text-sm mt-1">
          {posts?.length > 0
            ? `You have published ${posts.length} post${posts.length > 1 ? 's' : ''}`
            : "You haven't published any forum posts yet"}
        </p>
      </div>

      {/* Posts Grid */}
      {posts?.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <div
              key={post._id}
              className="group bg-white/5 border border-white/10 hover:border-primary/30 rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/5"
            >
              {/* Image */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-base-200 via-transparent to-transparent"></div>
                <span className="absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-bold bg-primary/20 text-primary border border-primary/30">
                  {post.authorRole}
                </span>
              </div>

              {/* Content */}
              <div className="p-5">
                <h3 className="text-white font-bold text-lg mb-2 line-clamp-1">
                  {post.title}
                </h3>
                <p className="text-neutral/60 text-sm line-clamp-2 mb-4">
                  {post.description}
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 text-xs text-neutral/50">
                    <span>👍 {post.likes?.length || 0}</span>
                    <span>👎 {post.dislikes?.length || 0}</span>
                    <span>💬 {post.comments?.length || 0}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/forum/${post._id}`}
                      className="px-3 py-1.5 rounded-lg text-xs font-medium bg-white/5 text-white hover:bg-white/10 transition-colors"
                    >
                      View
                    </Link>
                    <button
                      onClick={() => handleDelete(post._id)}
                      className="px-3 py-1.5 rounded-lg text-xs font-medium bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-white/5">
                  <p className="text-xs text-neutral/40">
                    {new Date(post.createdAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white/5 border border-white/10 rounded-2xl">
          <p className="text-5xl mb-4">📝</p>
          <h3 className="text-xl font-bold text-white mb-2">No Forum Posts Yet</h3>
          <p className="text-neutral/60 text-sm">
            Share your knowledge with the community!
          </p>
          <Link
            href="/dashboard/trainer/add-post"
            className="inline-block mt-4 px-6 py-2 bg-gradient-to-r from-primary to-accent rounded-full text-black font-bold text-sm hover:scale-105 transition-transform"
          >
            Create Post →
          </Link>
        </div>
      )}
    </div>
  );
}