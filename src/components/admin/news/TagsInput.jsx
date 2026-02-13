'use client';

import Button from '@components/admin/ui/Button';

export default function TagsInput({ label, placeholder, items, inputValue, onInputChange, onAdd, onRemove, variant = 'primary' }) {
  const colorClasses = variant === 'primary'
    ? 'bg-primary/10 text-primary border-primary/10'
    : 'bg-secondary/5 text-secondary border-secondary/10';

  return (
    <div>
      <label className="block text-sm font-bold text-secondary mb-2">{label}</label>
      <div className="flex gap-2 mb-3">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => onInputChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              onAdd();
            }
          }}
          className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-secondary"
          placeholder={placeholder}
        />
        <Button onClick={onAdd} variant="secondary">
          Əlavə et
        </Button>
      </div>
      {items.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {items.map((item) => (
            <span
              key={item}
              className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2 border ${colorClasses}`}
            >
              {item}
              <button
                type="button"
                onClick={() => onRemove(item)}
                className="hover:text-red-500 transition-colors"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
