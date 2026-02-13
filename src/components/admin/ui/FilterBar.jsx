import { X } from 'lucide-react';

export default function FilterBar({ children, onClear, showClear = false, checkboxes }) {
  return (
    <div className="space-y-4 mb-6">
      {/* Filter Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {children}
      </div>

      {/* Bottom Row: Checkboxes + Clear */}
      {(checkboxes || showClear) && (
        <div className="flex items-center gap-4 flex-wrap">
          {checkboxes}

          {showClear && (
            <button
              type="button"
              onClick={onClear}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg border border-gray-200 transition-colors"
            >
              <X size={14} />
              Filterləri təmizlə
            </button>
          )}
        </div>
      )}
    </div>
  );
}
