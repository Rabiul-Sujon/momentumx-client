'use client';

import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from '@/lib/axios';
import toast from 'react-hot-toast';

export default function CommentSection({ postId, comments, user }) {
  const queryClient = useQueryClient();
  const [comment, setComment] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState('');

  // Post comment
  const commentMutation = useMutation({
    mutationFn: (text) =>
      axios.post(`/api/comments`, { postId, text }),
    onSuccess: () => {
      toast.success('Comment posted!');
      setComment('');
      queryClient.invalidateQueries(['forum-post', postId]);
    },
    onError: (err) =>
      toast.error(err?.response?.data?.message || 'Failed to post comment'),
  });

  // Edit comment
  const editMutation = useMutation({
    mutationFn: ({ commentId, text }) =>
      axios.put(`/api/comments/${commentId}`, { text }),
    onSuccess: () => {
      toast.success('Comment updated!');
      setEditingId(null);
      queryClient.invalidateQueries(['forum-post', postId]);
    },
    onError: () => toast.error('Failed to update comment'),
  });

  // Delete comment
  const deleteMutation = useMutation({
    mutationFn: (commentId) =>
      axios.delete(`/api/comments/${commentId}`),
    onSuccess: () => {
      toast.success('Comment deleted');
      queryClient.invalidateQueries(['forum-post', postId]);
    },
    onError: () => toast.error('Failed to delete comment'),
  });

  // Reply to comment
  const replyMutation = useMutation({
    mutationFn: ({ commentId, text }) =>
      axios.post(`/api/comments/reply/${commentId}`, { text }),
    onSuccess: () => {
      toast.success('Reply posted!');
      setReplyingTo(null);
      setReplyText('');
      queryClient.invalidateQueries(['forum-post', postId]);
    },
    onError: (err) =>
      toast.error(err?.response?.data?.message || 'Failed to post reply'),
  });

  const handleCommentSubmit = () => {
    if (!comment.trim()) return;
    commentMutation.mutate(comment.trim());
  };

  const handleEditSubmit = (commentId) => {
    if (!editText.trim()) return;
    editMutation.mutate({ commentId, text: editText.trim() });
  };

  const handleReplySubmit = (commentId) => {
    if (!replyText.trim()) return;
    replyMutation.mutate({ commentId, text: replyText.trim() });
  };

  const startEdit = (comment) => {
    setEditingId(comment._id);
    setEditText(comment.text);
  };

  const startReply = (commentId) => {
    setReplyingTo(replyingTo === commentId ? null : commentId);
    setReplyText('');
  };

  return (
    <div className="space-y-6">
      {/* Add Comment */}
      {user ? (
        <div className="flex flex-col gap-3">
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Write a comment..."
            rows={3}
            className="w-full rounded-xl p-4 text-sm text-white resize-none outline-none bg-white/5 border border-white/10 focus:border-primary transition-colors"
          />
          <button
            onClick={handleCommentSubmit}
            disabled={commentMutation.isPending}
            className="self-end px-6 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-primary to-accent hover:scale-[1.02] transition-all disabled:opacity-50"
          >
            {commentMutation.isPending ? 'Posting...' : 'Post Comment'}
          </button>
        </div>
      ) : (
        <p className="text-sm text-primary cursor-pointer hover:underline" onClick={() => window.location.href = '/login'}>
          Login to comment →
        </p>
      )}

      {/* Comments List */}
      <div className="space-y-4">
        {comments?.length === 0 && (
          <p className="text-sm text-neutral/40 text-center py-4">No comments yet. Be the first!</p>
        )}
        {comments?.map((c) => (
          <div key={c._id} className="space-y-3">
            {/* Comment */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-primary">{c.userName}</span>
                <span className="text-xs text-neutral/40">
                  {new Date(c.createdAt).toLocaleDateString()}
                </span>
              </div>

              {editingId === c._id ? (
                <div className="flex flex-col gap-2">
                  <textarea
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    rows={2}
                    className="w-full rounded-lg p-3 text-sm text-white resize-none outline-none bg-white/10 border border-primary/30"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditSubmit(c._id)}
                      className="px-4 py-1.5 rounded-lg text-xs font-semibold text-white bg-gradient-to-r from-primary to-accent"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="px-4 py-1.5 rounded-lg text-xs font-semibold text-neutral/40 bg-white/5"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-white/70">{c.text}</p>
              )}

              {/* Actions */}
              {user && (
                <div className="flex items-center gap-3 mt-3">
                  <button
                    onClick={() => startReply(c._id)}
                    className="text-xs text-neutral/50 hover:text-white transition-colors"
                  >
                    Reply
                  </button>
                  {c.userEmail === user.email && (
                    <>
                      <button
                        onClick={() => startEdit(c)}
                        className="text-xs text-primary hover:text-primary/70 transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteMutation.mutate(c._id)}
                        className="text-xs text-red-400 hover:text-red-300 transition-colors"
                      >
                        Delete
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Reply Input */}
            {replyingTo === c._id && (
              <div className="ml-6 flex flex-col gap-2">
                <textarea
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Write a reply..."
                  rows={2}
                  className="w-full rounded-xl p-3 text-sm text-white resize-none outline-none bg-white/5 border border-accent/30"
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => handleReplySubmit(c._id)}
                    disabled={!replyText.trim()}
                    className="px-4 py-1.5 rounded-lg text-xs font-semibold text-white bg-gradient-to-r from-primary to-accent disabled:opacity-50"
                  >
                    Reply
                  </button>
                  <button
                    onClick={() => setReplyingTo(null)}
                    className="px-4 py-1.5 rounded-lg text-xs font-semibold text-neutral/40 bg-white/5"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {/* Replies */}
            {c.replies?.map((reply) => (
              <div
                key={reply._id}
                className="ml-6 rounded-xl p-4 bg-accent/5 border border-accent/10"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-semibold text-accent">{reply.userName}</span>
                  <span className="text-xs text-neutral/40">
                    {new Date(reply.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-sm text-white/60">{reply.text}</p>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}