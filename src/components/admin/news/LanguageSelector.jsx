'use client';

const LANGUAGES = [
  { code: 'az', flag: '🇦🇿', label: 'AZ' },
  { code: 'en', flag: '🇬🇧', label: 'EN' },
];

export default function LanguageSelector({ currentLang, onChange }) {
  return (
    <div className="flex items-center justify-end gap-3 px-8 py-4 border-b border-gray-100 bg-gray-50/50">
      <span className="text-sm font-semibold text-secondary">Dil seçimi:</span>
      <div className="flex gap-2">
        {LANGUAGES.map(({ code, flag, label }) => (
          <button
            key={code}
            onClick={() => onChange(code)}
            className={`px-4 py-2 rounded-lg font-bold text-sm transition-all shadow-sm ${
              currentLang === code
                ? 'bg-secondary text-white ring-2 ring-secondary ring-offset-2'
                : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
            }`}
          >
            {flag} {label}
          </button>
        ))}
      </div>
    </div>
  );
}
