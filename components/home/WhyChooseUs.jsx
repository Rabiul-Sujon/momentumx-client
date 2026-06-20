
'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import Link from 'next/link';

const features = [
  {
    icon: '🏋️',
    title: 'Expert Trainers',
    description: 'Learn from certified professionals with years of experience in fitness training.',
    color: 'from-primary to-primary/50'
  },
  {
    icon: '📊',
    title: 'Track Progress',
    description: 'Monitor your fitness journey with detailed analytics and performance metrics.',
    color: 'from-accent to-accent/50'
  },
  {
    icon: '🎯',
    title: 'Personalized Plans',
    description: 'Get custom workout plans tailored to your goals and fitness level.',
    color: 'from-primary to-accent'
  },
  {
    icon: '🤝',
    title: 'Community Support',
    description: 'Join a vibrant community of fitness enthusiasts sharing knowledge and motivation.',
    color: 'from-accent to-primary'
  },
  {
    icon: '📱',
    title: 'Easy Booking',
    description: 'Book classes instantly with our seamless and intuitive booking system.',
    color: 'from-primary to-primary/50'
  },
  {
    icon: '🏆',
    title: 'Achievements',
    description: 'Earn badges and rewards as you reach your fitness milestones.',
    color: 'from-accent to-accent/50'
  },
];

export default function WhyChooseUs() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <section ref={ref} className="py-24 bg-[#0A0F1E] relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <span className="inline-block px-4 py-2 rounded-full border border-primary/30 bg-primary/5 text-primary text-xs font-medium tracking-wider uppercase mb-4">
            Why MomentumX
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-tight">
            Why Choose{' '}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              MomentumX
            </span>
          </h2>
          <p className="mt-4 text-neutral/70 text-lg">
            Everything you need to achieve your fitness goals in one powerful platform
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group relative p-8 rounded-2xl bg-white/5 border border-white/10 hover:border-primary/30 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary/5"
            >
              {/* Gradient Hover Effect */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              {/* Icon */}
              <div className={`relative w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center text-2xl mb-5 group-hover:scale-110 transition-transform duration-300`}>
                {feature.icon}
              </div>

              <h3 className="relative text-xl font-bold text-white mb-3">
                {feature.title}
              </h3>
              <p className="relative text-neutral/60 text-sm leading-relaxed">
                {feature.description}
              </p>

              {/* Decorative Line */}
              <div className="absolute bottom-0 left-8 right-8 h-0.5 bg-gradient-to-r from-primary/20 via-primary to-primary/20 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center mt-16"
        >
          <Link
            href="/register"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-primary to-accent rounded-full font-bold text-black transition-all hover:scale-105 hover:shadow-2xl hover:shadow-primary/30"
          >
            Get Started Today
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}