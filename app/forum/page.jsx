"use client";

import { useState, Suspense } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";
import axios from "@/lib/axios";

function ForumPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const page = parseInt(searchParams.get("page") || "1");
  const limit = 6;

  const { data, isLoading } = useQuery({
    queryKey: ["forum", page],
    queryFn: () =>
      axios
        .get(`/api/forum?page=${page}&limit=${limit}`)
        .then((r) => r.data),
  });

  const posts = data?.posts || [];
  const totalPages = data?.totalPages || 1;

  const goToPage = (p) => {
    router.push(`/forum?page=${p}`);
  };

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

  return (
    <main
      className="min-h-screen py-16 px-4"
      style={{ background: "#0A0F1E", fontFamily: "DM Sans, sans-serif" }}
    >
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="text-center mb-12">
          <motion.span
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xs font-semibold uppercase tracking-widest px-4 py-1 rounded-full inline-block mb-4"
            style={{
              background: "rgba(123,47,255,0.15)",
              color: "#7B2FFF",
              border: "1px solid rgba(123,47,255,0.3)",
            }}
          >
            Community
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl lg:text-5xl font-bold text-white mb-4"
          >
            Community Forum
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-sm max-w-xl mx-auto"
            style={{ color: "rgba(255,255,255,0.4)" }}
          >
            Tips, stories, and knowledge from our trainers and admins.
          </motion.p>
        </div>

        {/* Posts grid */}
        {posts.length === 0 ? (
          <p className="text-center" style={{ color: "rgba(255,255,255,0.3)" }}>
            No posts found.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post, i) => (
              <motion.div
                key={post._id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07 }}
                className="rounded-2xl overflow-hidden flex flex-col"
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.07)",
                }}
              >
                {/* Image */}
                <div className="relative w-full h-48">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover"
                  />
                  {/* Role badge */}
                  <span
                    className="absolute top-3 left-3 text-xs font-semibold px-2 py-1 rounded-full capitalize"
                    style={{
                      background:
                        post.authorRole === "admin"
                          ? "rgba(0,212,255,0.2)"
                          : "rgba(123,47,255,0.2)",
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
                </div>

                {/* Content */}
                <div className="flex flex-col flex-1 p-5 gap-3">
                  <h2 className="text-white font-bold text-lg leading-snug line-clamp-2">
                    {post.title}
                  </h2>
                  <p
                    className="text-sm leading-relaxed line-clamp-3 flex-1"
                    style={{ color: "rgba(255,255,255,0.45)" }}
                  >
                    {post.description}
                  </p>

                  {/* Author + date */}
                  <div
                    className="flex items-center justify-between text-xs pt-3"
                    style={{
                      borderTop: "1px solid rgba(255,255,255,0.06)",
                      color: "rgba(255,255,255,0.3)",
                    }}
                  >
                    <span>{post.authorName}</span>
                    <span>
                      {new Date(post.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  </div>

                  {/* Read More */}
                  <button
                    onClick={() => router.push(`/forum/${post._id}`)}
                    className="w-full py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 hover:opacity-80"
                    style={{
                      background: "rgba(0,212,255,0.08)",
                      color: "#00D4FF",
                      border: "1px solid rgba(0,212,255,0.2)",
                    }}
                  >
                    Read More →
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-12">
            <button
              onClick={() => goToPage(page - 1)}
              disabled={page === 1}
              className="px-4 py-2 rounded-xl text-sm font-semibold transition-all disabled:opacity-30"
              style={{
                background: "rgba(255,255,255,0.05)",
                color: "rgba(255,255,255,0.6)",
                border: "1px solid rgba(255,255,255,0.1)",
              }}
            >
              ← Prev
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => goToPage(p)}
                className="w-10 h-10 rounded-xl text-sm font-semibold transition-all duration-200"
                style={{
                  background:
                    p === page
                      ? "linear-gradient(135deg, #00D4FF, #7B2FFF)"
                      : "rgba(255,255,255,0.05)",
                  color: p === page ? "#fff" : "rgba(255,255,255,0.4)",
                  border:
                    p === page
                      ? "none"
                      : "1px solid rgba(255,255,255,0.1)",
                }}
              >
                {p}
              </button>
            ))}

            <button
              onClick={() => goToPage(page + 1)}
              disabled={page === totalPages}
              className="px-4 py-2 rounded-xl text-sm font-semibold transition-all disabled:opacity-30"
              style={{
                background: "rgba(255,255,255,0.05)",
                color: "rgba(255,255,255,0.6)",
                border: "1px solid rgba(255,255,255,0.1)",
              }}
            >
              Next →
            </button>
          </div>
        )}
      </div>
    </main>
  );
}

export default function ForumPage() {
  return (
    <Suspense>
      <ForumPageInner />
    </Suspense>
  );
}