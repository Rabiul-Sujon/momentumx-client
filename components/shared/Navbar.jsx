'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { useAuth } from '@/providers/AuthProvider';
import { signOut } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/classes', label: 'All Classes' },
  { href: '/forum', label: 'Community Forum' },
];

const getDashboardLink = (role) => {
  if (role === 'admin') return '/dashboard/admin';
  if (role === 'trainer') return '/dashboard/trainer';
  return '/dashboard/user';
};

export default function Navbar() {
  const { user, isPending } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    await signOut();
    toast.success('Logged out successfully!');
    router.push('/');
  };

  const isActive = (href) => pathname === href;

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-base-300 bg-base-100/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center font-black text-black text-sm">
              MX
            </div>
            <span className="text-xl font-black tracking-tight">
              Momentum<span className="text-primary">X</span>
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors duration-200 relative group ${
                  isActive(link.href)
                    ? 'text-primary'
                    : 'text-neutral hover:text-white'
                }`}
              >
                {link.label}
                <span className={`absolute -bottom-1 left-0 h-0.5 bg-primary transition-all duration-200 ${
                  isActive(link.href) ? 'w-full' : 'w-0 group-hover:w-full'
                }`}></span>
              </Link>
            ))}

            {user && (
              <Link
                href={getDashboardLink(user.role)}
                className={`text-sm font-medium transition-colors duration-200 relative group ${
                  pathname.startsWith('/dashboard')
                    ? 'text-primary'
                    : 'text-neutral hover:text-white'
                }`}
              >
                Dashboard
                <span className={`absolute -bottom-1 left-0 h-0.5 bg-primary transition-all duration-200 ${
                  pathname.startsWith('/dashboard') ? 'w-full' : 'w-0 group-hover:w-full'
                }`}></span>
              </Link>
            )}
          </div>

          {/* Desktop Auth */}
          <div className="hidden md:flex items-center gap-4">
            {isPending ? (
              <div className="w-8 h-8 rounded-full bg-base-200 animate-pulse"></div>
            ) : user ? (
              <div className="dropdown dropdown-end">
                <div tabIndex={0} role="button" className="flex items-center gap-2 cursor-pointer">
                  <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-primary">
                    {user.image ? (
                      <Image
                        src={user.image}
                        alt={user.name}
                        width={36}
                        height={36}
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-black font-bold text-sm">
                        {user.name?.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                </div>
                <ul tabIndex={0} className="dropdown-content z-50 menu p-2 shadow-lg bg-base-200 border border-base-300 rounded-xl w-52 mt-2">
                  <li className="px-3 py-2 border-b border-base-300 mb-1">
                    <div>
                      <p className="font-semibold text-white text-sm">{user.name}</p>
                      <p className="text-neutral text-xs truncate">{user.email}</p>
                    </div>
                  </li>
                  <li>
                    <Link href={getDashboardLink(user.role)} className="text-sm">
                      Dashboard
                    </Link>
                  </li>
                  <li>
                    <button
                      onClick={handleLogout}
                      className="text-sm text-red-400 hover:text-red-300"
                    >
                      Logout
                    </button>
                  </li>
                </ul>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  href="/login"
                  className="text-sm font-medium text-neutral hover:text-white transition-colors"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="btn btn-primary btn-sm text-black font-bold rounded-full px-5"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden flex flex-col gap-1.5 p-2"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <span className={`block w-6 h-0.5 bg-white transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
            <span className={`block w-6 h-0.5 bg-white transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`}></span>
            <span className={`block w-6 h-0.5 bg-white transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden border-t border-base-300 py-4 flex flex-col gap-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className={`text-sm font-medium px-2 py-1.5 rounded-lg transition-colors ${
                  isActive(link.href)
                    ? 'text-primary bg-base-200'
                    : 'text-neutral hover:text-white hover:bg-base-200'
                }`}
              >
                {link.label}
              </Link>
            ))}

            {user && (
              <Link
                href={getDashboardLink(user.role)}
                onClick={() => setMenuOpen(false)}
                className="text-sm font-medium px-2 py-1.5 rounded-lg text-neutral hover:text-white hover:bg-base-200"
              >
                Dashboard
              </Link>
            )}

            <div className="border-t border-base-300 pt-3 mt-1">
              {user ? (
                <div className="flex items-center justify-between px-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-primary">
                      {user.image ? (
                        <Image
                          src={user.image}
                          alt={user.name}
                          width={32}
                          height={32}
                          className="object-cover w-full h-full"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-black font-bold text-xs">
                          {user.name?.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>
                    <span className="text-sm font-medium">{user.name}</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="text-sm text-red-400 hover:text-red-300"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="flex gap-3 px-2">
                  <Link
                    href="/login"
                    onClick={() => setMenuOpen(false)}
                    className="btn btn-outline btn-sm flex-1 rounded-full"
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setMenuOpen(false)}
                    className="btn btn-primary btn-sm flex-1 text-black font-bold rounded-full"
                  >
                    Get Started
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}