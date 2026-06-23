'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';

export default function PostCard({ post, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.07 }}
      className="group bg-base-200 border border-base-300 hover:border-primary/30 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1 flex flex-col"
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <Image
          src={post.image}
          alt={post.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-base-200 via-transparent to-transparent"></div>

        {/* Role Badge */}
        <span
          className={`absolute top-3 left-3 text-xs font-bold px-3 py-1 rounded-full capitalize border ${
            post.authorRole === 'admin'
              ? 'text-accent bg-accent/10 border-accent/30'
              : 'text-primary bg-primary/10 border-primary/30'
          }`}
        >
          {post.authorRole}
        </span>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-5">
        <h3 className="text-white font-bold text-lg mb-2 line-clamp-2 group-hover:text-primary transition-colors">
          {post.title}
        </h3>
        <p className="text-neutral/60 text-sm line-clamp-2 flex-1 mb-3">
          {post.description}
        </p>

        {/* Author & Date */}
        <div className="flex items-center justify-between text-xs text-neutral/50 pt-3 border-t border-white/5">
          <span>{post.authorName}</span>
          <span>
            {new Date(post.createdAt).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            })}
          </span>
        </div>

        {/* Likes & Comments */}
        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center gap-3 text-xs text-neutral/50">
            <span>👍 {post.likes?.length || 0}</span>
            <span>👎 {post.dislikes?.length || 0}</span>
            <span>💬 {post.comments?.length || 0}</span>
          </div>
          <Link
            href={`/forum/${post._id}`}
            className="px-4 py-1.5 rounded-lg text-xs font-medium bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
          >
            Read More
          </Link>
        </div>
      </div>
    </motion.div>
  );
}