import React, { useState } from 'react';
import { ChevronDownIcon } from './icons';

interface DemoCategoryProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  initialOpen?: boolean;
}

const DemoCategory: React.FC<DemoCategoryProps> = ({ title, icon, children, initialOpen = false }) => {
  const [isOpen, setIsOpen] = useState(initialOpen);

  return (
    <div className="bg-gray-800/50 border border-gray-700 rounded-lg shadow-md transition-all duration-300">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 text-left font-semibold text-lg text-gray-200 hover:bg-gray-700/50 rounded-t-lg focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
        aria-expanded={isOpen}
      >
        <div className="flex items-center">
            {icon}
            <span>{title}</span>
        </div>
        <ChevronDownIcon
          className={`w-5 h-5 text-gray-400 transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>
      <div
        className={`grid overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
        }`}
      >
        <div className="overflow-hidden">
            <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                 {children}
            </div>
        </div>
      </div>
    </div>
  );
};

export default DemoCategory;