'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import axios from '@/lib/axios';

export default function LatestPosts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLatestPosts = async () => {
      try {
        const res = await axios.get('/api/forum/latest');
        setPosts(res.data);
      } catch (error) {
        console.error('Error fetching latest posts:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchLatestPosts();
  }, []);

  return (
    <section className="py-24 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-base-200/20 to-transparent"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-accent/30 bg-accent/5 mb-4">
            <span className="text-accent text-xs font-medium tracking-wider uppercase">
              Community
            </span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-black text-white mb-4">
            Latest <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Forum Posts</span>
          </h2>
          <p className="text-neutral max-w-xl mx-auto">
            Stay updated with the latest fitness tips, workout guides, and community discussions from our expert trainers.
          </p>
        </motion.div>

        {/* Loading */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-base-200 rounded-2xl overflow-hidden animate-pulse">
                <div className="h-48 bg-base-300"></div>
                <div className="p-5 space-y-3">
                  <div className="h-4 bg-base-300 rounded w-3/4"></div>
                  <div className="h-3 bg-base-300 rounded w-full"></div>
                  <div className="h-3 bg-base-300 rounded w-2/3"></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Posts Grid */}
        {!loading && posts.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {posts.map((post, index) => (
              <motion.div
                key={post._id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group bg-base-200 border border-base-300 hover:border-accent/30 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-accent/5 hover:-translate-y-1"
              >
                {/* Image */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-base-200 via-transparent to-transparent"></div>
                  {/* Role Badge */}
                  <div className="absolute top-3 left-3">
                    <span className={`text-xs font-bold px-3 py-1 rounded-full capitalize ${
                      post.authorRole === 'admin'
                        ? 'text-accent bg-accent/10'
                        : 'text-primary bg-primary/10'
                    }`}>
                      {post.authorRole}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  <h3 className="text-white font-bold text-base mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-neutral text-sm mb-3 line-clamp-2">
                    {post.description}
                  </p>

                  {/* Author & Date */}
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-black text-xs font-bold">
                      {post.authorName?.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-neutral text-xs">{post.authorName}</span>
                  </div>

                  {/* Likes/Dislikes */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1 text-xs text-neutral">
                        👍 {post.likes?.length || 0}
                      </span>
                      <span className="flex items-center gap-1 text-xs text-neutral">
                        👎 {post.dislikes?.length || 0}
                      </span>
                    </div>
                  </div>

                  <Link
                    href={`/forum/${post._id}`}
                    className="btn btn-outline btn-sm w-full rounded-xl border-base-300 hover:border-accent hover:text-accent hover:bg-transparent transition-all"
                  >
                    Read More
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && posts.length === 0 && (
          <div className="text-center py-20">
            <p className="text-4xl mb-4">💬</p>
            <p className="text-neutral">No forum posts available yet.</p>
          </div>
        )}

        {/* View All */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mt-12"
        >
          <Link
            href="/forum"
            className="btn btn-outline rounded-full px-10 border-accent text-accent hover:bg-accent hover:text-black hover:border-accent"
          >
            View All Posts
          </Link>
        </motion.div>
      </div>
    </section>
  );
}