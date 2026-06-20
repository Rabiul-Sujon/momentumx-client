"use client";

import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import axios from "@/lib/axios";
import { authClient } from "@/lib/auth-client";
import toast from "react-hot-toast";

export default function ForumPostDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: session } = authClient.useSession();
  const user = session?.user;

  const [comment, setComment] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState("");

  // Fetch post
  const { data: post, isLoading } = useQuery({
    queryKey: ["forum-post", id],
    queryFn: () => axios.get(`/api/forum/${id}`).then((r) => r.data),
  });

  // Post comment
  const commentMutation = useMutation({
    mutationFn: (text) =>
      axios.post(`/api/forum/${id}/comments`, { text }),
    onSuccess: () => {
      toast.success("Comment posted!");
      setComment("");
      queryClient.invalidateQueries(["forum-post", id]);
    },
    onError: (err) =>
      toast.error(err?.response?.data?.message || "Failed to post comment"),
  });

  // Edit comment
  const editMutation = useMutation({
    mutationFn: ({ commentId, text }) =>
      axios.put(`/api/forum/${id}/comments/${commentId}`, { text }),
    onSuccess: () => {
      toast.success("Comment updated!");
      setEditingId(null);
      queryClient.invalidateQueries(["forum-post", id]);
    },
    onError: () => toast.error("Failed to update comment"),
  });

  // Delete comment
  const deleteMutation = useMutation({
    mutationFn: (commentId) =>
      axios.delete(`/api/forum/${id}/comments/${commentId}`),
    onSuccess: () => {
      toast.success("Comment deleted");
      queryClient.invalidateQueries(["forum-post", id]);
    },
    onError: () => toast.error("Failed to delete comment"),
  });

  // Reply
  const replyMutation = useMutation({
    mutationFn: ({ commentId, text }) =>
      axios.post(`/api/forum/${id}/comments/${commentId}/reply`, { text }),
    onSuccess: () => {
      toast.success("Reply posted!");
      setReplyingTo(null);
      setReplyText("");
      queryClient.invalidateQueries(["forum-post", id]);
    },
    onError: (err) =>
      toast.error(err?.response?.data?.message || "Failed to post reply"),
  });

  // Like
  const likeMutation = useMutation({
    mutationFn: () => axios.post(`/api/forum/${id}/like`),
    onSuccess: () => queryClient.invalidateQueries(["forum-post", id]),
    onError: (err) =>
      toast.error(err?.response?.data?.message || "Failed to like"),
  });

  // Dislike
  const dislikeMutation = useMutation({
    mutationFn: () => axios.post(`/api/forum/${id}/dislike`),
    onSuccess: () => queryClient.invalidateQueries(["forum-post", id]),
    onError: (err) =>
      toast.error(err?.response?.data?.message || "Failed to dislike"),
  });

  const hasLiked = post?.likes?.includes(user?.id);
  const hasDisliked = post?.dislikes?.includes(user?.id);

  if (isLoading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: "#0A0F1E" }}
      >
        <span
          className="loading loading-spinner loading-lg"
          style={{ color: "#00D4FF" }}
        ></span>
      </div>
    );
  }

  if (!post) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: "#0A0F1E" }}
      >
        <p className="text-white">Post not found.</p>
      </div>
    );
  }

  return (
    <main
      className="min-h-screen py-16 px-4"
      style={{ background: "#0A0F1E", fontFamily: "DM Sans, sans-serif" }}
    >
      <div className="max-w-3xl mx-auto">

        {/* Back */}
        <button
          onClick={() => router.back()}
          className="text-sm mb-8 transition-opacity hover:opacity-70"
          style={{ color: "#00D4FF" }}
        >
          ← Back to Forum
        </button>

        {/* Post */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {/* Image */}
          <div className="relative w-full h-72 rounded-2xl overflow-hidden mb-8">
            <Image
              src={post.image}
              alt={post.title}
              fill
              className="object-cover"
            />
          </div>

          {/* Meta */}
          <div className="flex items-center gap-3 mb-4">
            <span
              className="text-xs font-semibold px-3 py-1 rounded-full capitalize"
              style={{
                background:
                  post.authorRole === "admin"
                    ? "rgba(0,212,255,0.15)"
                    : "rgba(123,47,255,0.15)",
                color:
                  post.authorRole === "admin" ? "#00D4FF" : "#7B2FFF",
                border: `1px solid ${
                  post.authorRole === "admin"
                    ? "rgba(0,212,255,0.3)"
                    : "rgba(123,47,255,0.3)"
                }`,
              }}
            >
              {post.authorRole}
            </span>
            <span
              className="text-sm"
              style={{ color: "rgba(255,255,255,0.4)" }}
            >
              {post.authorName} &bull;{" "}
              {new Date(post.createdAt).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </span>
          </div>

          {/* Title */}
          <h1 className="text-3xl lg:text-4xl font-bold text-white mb-6">
            {post.title}
          </h1>

          {/* Description */}
          <p
            className="text-base leading-relaxed mb-8"
            style={{ color: "rgba(255,255,255,0.6)" }}
          >
            {post.description}
          </p>

          {/* Like / Dislike */}
          <div className="flex items-center gap-4 mb-12">
            <button
              onClick={() => {
                if (!user) return router.push("/login");
                likeMutation.mutate();
              }}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200"
              style={{
                background: hasLiked
                  ? "rgba(0,212,255,0.15)"
                  : "rgba(255,255,255,0.05)",
                color: hasLiked ? "#00D4FF" : "rgba(255,255,255,0.4)",
                border: `1px solid ${
                  hasLiked
                    ? "rgba(0,212,255,0.3)"
                    : "rgba(255,255,255,0.1)"
                }`,
              }}
            >
              👍 {post.likes?.length || 0}
            </button>
            <button
              onClick={() => {
                if (!user) return router.push("/login");
                dislikeMutation.mutate();
              }}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200"
              style={{
                background: hasDisliked
                  ? "rgba(123,47,255,0.15)"
                  : "rgba(255,255,255,0.05)",
                color: hasDisliked ? "#7B2FFF" : "rgba(255,255,255,0.4)",
                border: `1px solid ${
                  hasDisliked
                    ? "rgba(123,47,255,0.3)"
                    : "rgba(255,255,255,0.1)"
                }`,
              }}
            >
              👎 {post.dislikes?.length || 0}
            </button>
          </div>

          {/* Comments section */}
          <div
            className="rounded-2xl p-6"
            style={{
              background: "rgba(255,255,255,0.02)",
              border: "1px solid rgba(255,255,255,0.07)",
            }}
          >
            <h2 className="text-white font-bold text-xl mb-6">
              Comments ({post.comments?.length || 0})
            </h2>

            {/* Add comment */}
            {user ? (
              <div className="flex flex-col gap-3 mb-8">
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Write a comment..."
                  rows={3}
                  className="w-full rounded-xl p-4 text-sm text-white resize-none outline-none"
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    color: "white",
                  }}
                />
                <button
                  onClick={() => {
                    if (!comment.trim()) return;
                    commentMutation.mutate(comment.trim());
                  }}
                  disabled={commentMutation.isPending}
                  className="self-end px-6 py-2.5 rounded-xl text-sm font-semibold text-white transition-all"
                  style={{
                    background: "linear-gradient(135deg, #00D4FF, #7B2FFF)",
                  }}
                >
                  {commentMutation.isPending ? "Posting..." : "Post Comment"}
                </button>
              </div>
            ) : (
              <p
                className="text-sm mb-8 cursor-pointer hover:underline"
                style={{ color: "#00D4FF" }}
                onClick={() => router.push("/login")}
              >
                Login to comment →
              </p>
            )}

            {/* Comments list */}
            <div className="flex flex-col gap-6">
              {post.comments?.length === 0 && (
                <p
                  className="text-sm"
                  style={{ color: "rgba(255,255,255,0.3)" }}
                >
                  No comments yet. Be the first!
                </p>
              )}
              {post.comments?.map((c) => (
                <div key={c._id} className="flex flex-col gap-2">
                  {/* Comment */}
                  <div
                    className="rounded-xl p-4"
                    style={{
                      background: "rgba(255,255,255,0.04)",
                      border: "1px solid rgba(255,255,255,0.07)",
                    }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span
                        className="text-sm font-semibold"
                        style={{ color: "#00D4FF" }}
                      >
                        {c.userName}
                      </span>
                      <span
                        className="text-xs"
                        style={{ color: "rgba(255,255,255,0.3)" }}
                      >
                        {new Date(c.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    {/* Edit mode */}
                    {editingId === c._id ? (
                      <div className="flex flex-col gap-2 mt-2">
                        <textarea
                          value={editText}
                          onChange={(e) => setEditText(e.target.value)}
                          rows={2}
                          className="w-full rounded-lg p-3 text-sm text-white resize-none outline-none"
                          style={{
                            background: "rgba(255,255,255,0.06)",
                            border: "1px solid rgba(0,212,255,0.2)",
                          }}
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={() =>
                              editMutation.mutate({
                                commentId: c._id,
                                text: editText,
                              })
                            }
                            className="px-4 py-1.5 rounded-lg text-xs font-semibold text-white"
                            style={{
                              background:
                                "linear-gradient(135deg, #00D4FF, #7B2FFF)",
                            }}
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditingId(null)}
                            className="px-4 py-1.5 rounded-lg text-xs font-semibold"
                            style={{
                              background: "rgba(255,255,255,0.06)",
                              color: "rgba(255,255,255,0.4)",
                            }}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <p
                        className="text-sm"
                        style={{ color: "rgba(255,255,255,0.6)" }}
                      >
                        {c.text}
                      </p>
                    )}

                    {/* Comment actions */}
                    {user && (
                      <div className="flex items-center gap-3 mt-3">
                        <button
                          onClick={() => {
                            setReplyingTo(
                              replyingTo === c._id ? null : c._id
                            );
                            setReplyText("");
                          }}
                          className="text-xs transition-opacity hover:opacity-70"
                          style={{ color: "rgba(255,255,255,0.3)" }}
                        >
                          Reply
                        </button>
                        {c.userId === user?.id && (
                          <>
                            <button
                              onClick={() => {
                                setEditingId(c._id);
                                setEditText(c.text);
                              }}
                              className="text-xs transition-opacity hover:opacity-70"
                              style={{ color: "#00D4FF" }}
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => deleteMutation.mutate(c._id)}
                              className="text-xs transition-opacity hover:opacity-70"
                              style={{ color: "#ff4d4d" }}
                            >
                              Delete
                            </button>
                          </>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Reply input */}
                  {replyingTo === c._id && (
                    <div className="ml-6 flex flex-col gap-2">
                      <textarea
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        placeholder="Write a reply..."
                        rows={2}
                        className="w-full rounded-xl p-3 text-sm text-white resize-none outline-none"
                        style={{
                          background: "rgba(255,255,255,0.04)",
                          border: "1px solid rgba(123,47,255,0.2)",
                        }}
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={() =>
                            replyMutation.mutate({
                              commentId: c._id,
                              text: replyText.trim(),
                            })
                          }
                          disabled={!replyText.trim()}
                          className="px-4 py-1.5 rounded-lg text-xs font-semibold text-white"
                          style={{
                            background:
                              "linear-gradient(135deg, #00D4FF, #7B2FFF)",
                          }}
                        >
                          Reply
                        </button>
                        <button
                          onClick={() => setReplyingTo(null)}
                          className="px-4 py-1.5 rounded-lg text-xs font-semibold"
                          style={{
                            background: "rgba(255,255,255,0.06)",
                            color: "rgba(255,255,255,0.4)",
                          }}
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
                      className="ml-6 rounded-xl p-4"
                      style={{
                        background: "rgba(123,47,255,0.05)",
                        border: "1px solid rgba(123,47,255,0.1)",
                      }}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span
                          className="text-xs font-semibold"
                          style={{ color: "#7B2FFF" }}
                        >
                          {reply.userName}
                        </span>
                        <span
                          className="text-xs"
                          style={{ color: "rgba(255,255,255,0.3)" }}
                        >
                          {new Date(reply.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p
                        className="text-sm"
                        style={{ color: "rgba(255,255,255,0.5)" }}
                      >
                        {reply.text}
                      </p>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </main>
  );
}