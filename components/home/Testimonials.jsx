'use client';

import { motion } from 'framer-motion';

const testimonials = [
  {
    name: 'Sarah Johnson',
    role: 'Yoga Enthusiast',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
    rating: 5,
    text: '"MomentumX completely transformed my fitness routine. The yoga classes are incredible and the trainers are so supportive!"',
  },
  {
    name: 'Mike Chen',
    role: 'HIIT Athlete',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100',
    rating: 5,
    text: '"I have tried many fitness platforms but MomentumX stands out. The booking system is seamless and classes are top-notch."',
  },
  {
    name: 'Emily Rodriguez',
    role: 'Weight Training',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100',
    rating: 5,
    text: '"The community here is amazing! I have made so many friends and achieved goals I never thought possible."',
  },
  {
    name: 'David Kim',
    role: 'Cardio Runner',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100',
    rating: 5,
    text: '"Best investment I made for my health. The trainers are certified professionals who really care about your progress."',
  },
];

export default function Testimonials() {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl"></div>

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
              Testimonials
            </span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-black text-white mb-4">
            What Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Members Say</span>
          </h2>
          <p className="text-neutral max-w-xl mx-auto">
            Real stories from real people who transformed their lives with MomentumX.
          </p>
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-base-200 border border-base-300 hover:border-primary/20 rounded-2xl p-6 transition-all duration-300 hover:shadow-xl hover:shadow-primary/5"
            >
              {/* Rating */}
              <div className="flex items-center gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <span key={i} className="text-yellow-400 text-sm">⭐</span>
                ))}
              </div>

              {/* Text */}
              <p className="text-neutral text-sm leading-relaxed mb-6">
                {testimonial.text}
              </p>

              {/* Author */}
              <div className="flex items-center gap-3">
                <img
  src={testimonial.avatar}
  alt={testimonial.name}
  className="w-10 h-10 rounded-full object-cover"
/>
                <div>
                  <p className="text-white font-bold text-sm">{testimonial.name}</p>
                  <p className="text-neutral text-xs">{testimonial.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}