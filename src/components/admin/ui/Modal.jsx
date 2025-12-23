'use client';

import { X } from 'lucide-react';
import { useEffect } from 'react';

export default function Modal({ isOpen, onClose, title, children, size = 'md' }) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-2xl',
    lg: 'max-w-4xl',
    xl: 'max-w-6xl',
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="fixed inset-0 bg-[#2C4B62]/50 backdrop-blur-sm transition-opacity" onClick={onClose}></div>
        
        <div className={`relative bg-white rounded-xl shadow-2xl w-full ${sizes[size]} transform transition-all`}>
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <h3 className="text-lg font-bold text-[#2C4B62] font-montserrat">{title}</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-[#2C4B62] transition-colors bg-gray-50 hover:bg-[#AA9674]/20 rounded-full p-1"
            >
              <X size={20} />
            </button>
          </div>
          
          <div className="px-6 py-6">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
