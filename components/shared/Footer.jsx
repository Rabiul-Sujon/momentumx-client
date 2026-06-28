'use client';

import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-base-200 border-t border-base-300 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">

          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            {/* Logo */}
           <Link href="/">
              <img
               src="https://res.cloudinary.com/dqg9ygns9/image/upload/v1782638200/momentumx.logo_q4cr35.png"
               alt="MomentumX"
               className="h-30 w-auto object-contain -mt-10 -mb-6"
               />
           </Link>
            {/* <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center font-black text-black text-sm">
                MX
              </div>
              <span className="text-xl font-black tracking-tight">
                Momentum<span className="text-primary">X</span>
              </span>
            </Link> */}
            <p className="text-neutral text-sm leading-relaxed max-w-xs">
              Your ultimate fitness management platform. Discover classes, book sessions, and track your fitness journey with MomentumX.
            </p>
            {/* Social Media Links */}
            <div className="flex items-center gap-4 mt-6">
              {/* X (Twitter) - New Logo */}
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-base-300 hover:bg-primary hover:text-black flex items-center justify-center transition-all duration-200 text-neutral"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.748l7.73-8.835L1.254 2.25H8.08l4.259 5.63L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z"/>
                </svg>
              </a>
              {/* Facebook */}
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-base-300 hover:bg-primary hover:text-black flex items-center justify-center transition-all duration-200 text-neutral"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              {/* Instagram */}
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-base-300 hover:bg-primary hover:text-black flex items-center justify-center transition-all duration-200 text-neutral"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                </svg>
              </a>
              {/* YouTube */}
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-base-300 hover:bg-primary hover:text-black flex items-center justify-center transition-all duration-200 text-neutral"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-4 -ml-10">
              Quick Links
            </h3>
            <ul className="space-y-2 -ml-10">
              {[
                { href: '/', label: 'Home' },
                { href: '/classes', label: 'All Classes' },
                { href: '/forum', label: 'Community Forum' },
                { href: '/login', label: 'Login' },
                { href: '/register', label: 'Register' },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-neutral text-sm hover:text-primary transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-4">
              Contact Us
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-sm text-neutral">
                <span className="mt-0.5">🏠</span>
                <span>123 Fitness Street, Dhaka, Bangladesh</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-neutral">
                <span>📧</span>
                <a href="mailto:support@momentumx.com" className="hover:text-primary transition-colors">
                  support@momentumx.com
                </a>
              </li>
              <li className="flex items-center gap-2 text-sm text-neutral">
                <span>📞</span>
                <a href="tel:+8801234567890" className="hover:text-primary transition-colors">
                  +880 1234 567890
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-base-300 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-neutral text-sm">
            © {new Date().getFullYear()} MomentumX. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link href="#" className="text-neutral text-sm hover:text-primary transition-colors">
              Privacy Policy
            </Link>
            <Link href="#" className="text-neutral text-sm hover:text-primary transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}