'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/providers/AuthProvider';
import { useState } from 'react';

const userLinks = [
  { href: '/dashboard/user', label: 'Overview', icon: '📊' },
  { href: '/dashboard/user/booked-classes', label: 'Booked Classes', icon: '📅' }, // ✅ fixed
  { href: '/dashboard/user/apply-trainer', label: 'Apply as Trainer', icon: '📝' },
  { href: '/dashboard/user/favorites', label: 'Favorite Classes', icon: '❤️' },
];

const trainerLinks = [
  { href: '/dashboard/trainer', label: 'Overview', icon: '📊' },
  { href: '/dashboard/trainer/add-class', label: 'Add Class', icon: '➕' },
  { href: '/dashboard/trainer/my-classes', label: 'My Classes', icon: '📚' },
  { href: '/dashboard/trainer/add-post', label: 'Add Forum Post', icon: '✏️' },
  { href: '/dashboard/trainer/my-posts', label: 'My Forum Posts', icon: '📝' },
];

const adminLinks = [
  { href: '/dashboard/admin', label: 'Overview', icon: '📊' },
  { href: '/dashboard/admin/manage-users', label: 'Manage Users', icon: '👥' },
  { href: '/dashboard/admin/applied-trainers', label: 'Applied Trainers', icon: '📋' },
  { href: '/dashboard/admin/manage-trainers', label: 'Manage Trainers', icon: '👨‍🏫' },
  { href: '/dashboard/admin/manage-classes', label: 'Manage Classes', icon: '📚' },
  { href: '/dashboard/admin/add-post', label: 'Add Forum Post', icon: '✏️' }, // ✅ fixed
  { href: '/dashboard/admin/transactions', label: 'Transactions', icon: '💰' },
  { href: '/dashboard/admin/manage-posts', label: 'Forum Posts', icon: '🗂️' }, // ✅ fixed
];

export default function Sidebar({ isOpen, onClose }) {
  const pathname = usePathname();
  const { user } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  if (!user) return null;

  let links = [];
  if (user.role === 'admin') links = adminLinks;
  else if (user.role === 'trainer') links = trainerLinks;
  else links = userLinks;

  const isActive = (href) => pathname === href;

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`
          fixed lg:sticky top-16 left-0 z-50 h-[calc(100vh-4rem)] 
          bg-[#0A0F1E] border-r border-white/10 
          transition-all duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          ${collapsed ? 'w-20' : 'w-64'}
          flex flex-col overflow-y-auto
        `}
      >
        {/* Toggle Button (Desktop) */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="hidden lg:flex items-center justify-center h-12 border-b border-white/5 text-neutral/50 hover:text-white transition-colors"
        >
          {collapsed ? '→' : '←'}
        </button>

        {/* Navigation */}
        <nav className="flex-1 p-3 space-y-1">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={onClose}
              className={`
                flex items-center gap-3 px-4 py-3 rounded-xl 
                transition-all duration-200 group
                ${isActive(link.href)
                  ? 'bg-gradient-to-r from-primary/20 to-accent/20 border border-primary/30 text-white'
                  : 'text-neutral/60 hover:bg-white/5 hover:text-white'
                }
                ${collapsed ? 'justify-center' : ''}
              `}
            >
              <span className="text-xl">{link.icon}</span>
              {!collapsed && (
                <span className="text-sm font-medium">{link.label}</span>
              )}
              {isActive(link.href) && (
                <div className="ml-auto w-1.5 h-8 rounded-full bg-gradient-to-b from-primary to-accent" />
              )}
            </Link>
          ))}
        </nav>

        {/* User Info (Collapsed only shows avatar) */}
        <div className="border-t border-white/5 p-3">
          <div className={`
            flex items-center gap-3 rounded-xl p-2 bg-white/5
            ${collapsed ? 'justify-center' : ''}
          `}>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-black font-bold text-xs overflow-hidden flex-shrink-0">
              {user.image ? (
                <img src={user.image} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                user.name?.charAt(0).toUpperCase()
              )}
            </div>
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">{user.name}</p>
                <p className="text-xs text-neutral/50 truncate capitalize">{user.role}</p>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}