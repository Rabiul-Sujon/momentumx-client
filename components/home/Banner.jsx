'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import Image from 'next/image';

export default function Banner() {
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">

      {/* Background Effects */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,212,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,212,255,0.03)_1px,transparent_1px)] bg-[size:64px_64px]"></div>
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-accent/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/5 mb-6"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              <span className="text-primary text-xs font-medium tracking-wider uppercase">
                #1 Fitness Platform
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-4xl sm:text-5xl lg:text-7xl font-black leading-[1.1] tracking-tight"
            >
              <span className="text-white">Transform Your</span>
              <br />
              <span className="bg-gradient-to-r from-primary via-primary to-accent bg-clip-text text-transparent">
                Fitness Journey
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="mt-6 text-lg text-neutral/80 leading-relaxed max-w-lg"
            >
              Discover premium fitness classes, connect with expert trainers, and track your progress — all in one powerful platform.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="mt-10 flex flex-wrap gap-4"
            >
              <Link
                href="/classes"
                className="group relative px-8 py-4 bg-gradient-to-r from-primary to-accent rounded-full font-bold text-black overflow-hidden transition-all hover:scale-105 hover:shadow-2xl hover:shadow-primary/25"
              >
                <span className="relative z-10 flex items-center gap-2">
                  Explore Classes
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </span>
                <div className="absolute inset-0 bg-white/20 group-hover:translate-y-full transition-transform duration-300" />
              </Link>

              <Link
                href="/register"
                className="px-8 py-4 border border-white/10 rounded-full text-white font-medium hover:bg-white/5 transition-all hover:border-primary/50"
              >
                Join For Free
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="mt-12 flex gap-8 sm:gap-12"
            >
              {[
                { number: '500+', label: 'Active Classes' },
                { number: '12K+', label: 'Happy Members' },
                { number: '50+', label: 'Expert Trainers' },
              ].map((stat, i) => (
                <div key={i} className="text-center">
                  <p className="text-2xl sm:text-3xl font-black text-white">{stat.number}</p>
                  <p className="text-xs sm:text-sm text-neutral/60 mt-1">{stat.label}</p>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right Content — Bodybuilder Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="hidden lg:flex justify-center items-center"
          >
            <div className="relative w-full max-w-lg h-[600px]">

              {/* Glow behind image */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 rounded-3xl blur-2xl scale-95"></div>

              {/* Main Image */}
              <div className="relative w-full h-full rounded-3xl overflow-hidden border border-white/10">
                <Image
                src="https://res.cloudinary.com/dqg9ygns9/image/upload/v1782614839/huge-shirtless-bearded-bodybuilder-with-sporty-woman-azure-sportswear-posing-natural-light-near-window_i32pcn.jpg"
                alt="Bodybuilder"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover object-top"
                loading="eager"
                 />
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-base-100/60 via-transparent to-transparent"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-base-100/20 via-transparent to-transparent"></div>
              </div>

              {/* Floating Card 1 — Top Right */}
              <motion.div
                animate={{ y: [-8, 8, -8] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute -top-6 -right-6 bg-base-200/90 backdrop-blur-md border border-primary/30 rounded-2xl p-4 shadow-lg shadow-primary/10 z-20"
              >
                <p className="text-2xl">🔥</p>
                <p className="text-white text-xs font-bold mt-1">Trending</p>
                <p className="text-neutral text-xs">HIIT Classes</p>
              </motion.div>

              {/* Floating Card 2 — Bottom Left */}
              <motion.div
                animate={{ y: [8, -8, 8] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute -bottom-6 -left-6 bg-base-200/90 backdrop-blur-md border border-accent/30 rounded-2xl p-4 shadow-lg shadow-accent/10 z-20"
              >
                <p className="text-2xl">⚡</p>
                <p className="text-white text-xs font-bold mt-1">500+ Members</p>
                <p className="text-neutral text-xs">Join Today</p>
              </motion.div>

              {/* Floating Card 3 — Middle Right */}
              <motion.div
                animate={{ y: [-5, 5, -5] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                className="absolute top-1/2 -right-8 -translate-y-1/2 bg-base-200/90 backdrop-blur-md border border-primary/20 rounded-2xl p-4 shadow-lg z-20"
              >
                <p className="text-2xl">💪</p>
                <p className="text-white text-xs font-bold mt-1">50+ Trainers</p>
                <p className="text-neutral text-xs">Expert Coaches</p>
              </motion.div>

            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}