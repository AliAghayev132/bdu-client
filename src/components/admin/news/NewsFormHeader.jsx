'use client';

import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

const STEPS = [
  { id: 1, label: '1. Məzmun' },
  { id: 2, label: '2. Parametrlər' },
];

export default function NewsFormHeader({ title, currentStep }) {
  const router = useRouter();

  return (
    <div className="flex items-center justify-between px-8 py-5 border-b border-gray-100 bg-white sticky top-0 z-10">
      <div className="flex items-center gap-6">
        <button
          onClick={() => router.back()}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500 hover:text-secondary"
          title="Geri"
        >
          <ArrowLeft size={22} />
        </button>
        <h1 className="text-2xl font-bold text-secondary font-montserrat">
          {title}
        </h1>
        <div className="flex items-center gap-3 text-sm font-medium">
          {STEPS.map((step, i) => (
            <span key={step.id}>
              {i > 0 && <span className="text-gray-300 mr-3">→</span>}
              <span
                className={`px-4 py-1.5 rounded-full transition-colors ${
                  currentStep === step.id
                    ? 'bg-primary/10 text-primary border border-primary/20'
                    : 'bg-gray-100 text-gray-500'
                }`}
              >
                {step.label}
              </span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
