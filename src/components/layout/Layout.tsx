import React from 'react';
import Sidebar from './Sidebar';
import { useTheme } from '../../contexts/ThemeContext';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { resolvedTheme } = useTheme();

  return (
    <div className={`min-h-screen ${
      resolvedTheme === 'dark' ? 'bg-dark-bg text-dark-text' : 'bg-gray-100'
    }`}>
      <Sidebar />
      <div className="pl-64">
        <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          {children}
        </main>
      </div>
    </div>
  );
} 