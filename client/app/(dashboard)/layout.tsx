'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';
import { useUIStore } from '@/store/uiStore';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout } = useAuthStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { darkMode, toggleDarkMode } = useUIStore();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) router.replace('/login');
  }, [router]);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const navLinks = [
    { href: '/blogs', label: 'Blogs', icon: '📝' },
    { href: '/analytics', label: 'Analytics', icon: '📊' },
    { href: '/settings', label: 'Settings', icon: '⚙️' },
  ];

  return (
    <div className={`min-h-screen flex ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside className={`fixed top-0 left-0 h-full w-56 border-r flex flex-col z-30 transform transition-transform duration-200
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0
        ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
        <div className={`px-6 py-5 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <h1 className={`text-base font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Blog Dashboard</h1>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navLinks.map(link => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition ${
                pathname === link.href
                  ? 'bg-blue-50 text-blue-600'
                  : darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {link.icon} {link.label}
            </Link>
          ))}
        </nav>
        <div className={`px-4 py-4 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <p className={`text-xs mb-2 truncate ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{user?.name || 'User'}</p>
          <button
            onClick={handleLogout}
            className="w-full text-left text-sm text-red-500 hover:text-red-600 font-medium transition"
          >
            Logout
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col lg:ml-56">
        <header className={`sticky top-0 z-10 border-b px-6 py-4 flex items-center justify-between
          ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
          <div className="flex items-center gap-3">
            <button
              className={`lg:hidden ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <h2 className={`text-sm font-semibold capitalize ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              {pathname.replace('/', '')}
            </h2>
          </div>
          <div className="flex items-center gap-3">
            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className={`text-xl transition ${darkMode ? 'text-yellow-400' : 'text-gray-500'}`}
              title="Toggle Dark Mode"
            >
              {darkMode ? '☀️Day' : '🌙Night'}
            </button>
            <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-semibold">
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <span className={`text-sm font-medium hidden sm:block ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              {user?.name || 'User'}
            </span>
            <button
              onClick={handleLogout}
              className="text-sm text-gray-400 hover:text-red-500 transition hidden sm:block"
            >
              Logout
            </button>
          </div>
        </header>

        <main className={`flex-1 p-6 ${darkMode ? 'text-white' : ''}`}>
          {children}
        </main>
      </div>
    </div>
  );
}