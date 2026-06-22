'use client';

import { useState } from 'react';
import { useAuth } from '@/providers/AuthProvider';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Sidebar from '@/components/dashboard/Sidebar';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

export default function DashboardLayout({ children }) {
  const { user, isPending } = useAuth();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  //  console.log('user:', user);
  // console.log('isPending:', isPending);

  useEffect(() => {
    if (!isPending && !user) {
      router.push('/login');
    }
  }, [user, isPending, router]);

  if (isPending) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#0A0F1E]">
      {/* Top Bar */}
      <div className="sticky top-0 z-40 bg-[#0A0F1E]/80 backdrop-blur-md border-b border-white/10 h-16 flex items-center px-4 lg:px-8">
        <button
          onClick={() => setSidebarOpen(true)}
          className="lg:hidden p-2 rounded-lg hover:bg-white/5 transition-colors"
        >
          <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <div className="flex-1" />
        <div className="flex items-center gap-3">
          <span className="text-sm text-neutral/60 hidden sm:inline">
            {user.role?.charAt(0).toUpperCase() + user.role?.slice(1)}
          </span>
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-black font-bold text-xs overflow-hidden">
            {user.image ? (
              <img src={user.image} alt={user.name} className="w-full h-full object-cover" />
            ) : (
              user.name?.charAt(0).toUpperCase()
            )}
          </div>
        </div>
      </div>

      <div className="flex">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}