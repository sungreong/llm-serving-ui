import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  DocumentTextIcon, 
  BeakerIcon, 
  Cog6ToothIcon,
  ServerIcon,
} from '@heroicons/react/24/outline';

const navigation = [
  { name: '모델 관리', path: '/', icon: DocumentTextIcon },
  { name: '모델 테스트', path: '/test', icon: BeakerIcon },
  { name: '모델 서빙', path: '/serving', icon: ServerIcon },
  { name: '설정', path: '/settings', icon: Cog6ToothIcon },
];

export default function Sidebar() {
  const location = useLocation();

  return (
    <div className="fixed inset-y-0 left-0 w-64 bg-gray-900 text-white">
      <div className="flex h-16 items-center justify-center border-b border-gray-800">
        <span className="text-xl font-bold">Ollama/VLLM 관리자</span>
      </div>
      <nav className="mt-5 px-2">
        <div className="space-y-1">
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`${
                  location.pathname === item.path
                    ? 'bg-gray-800 text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                } group flex items-center px-2 py-2 text-base font-medium rounded-md`}
              >
                <Icon className="mr-4 h-6 w-6" />
                {item.name}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
} 