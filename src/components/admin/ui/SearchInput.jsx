import { Search } from 'lucide-react';

export default function SearchInput({ value, onChange, placeholder = 'Axtar...', className = '' }) {
  return (
    <div className={`relative ${className}`}>
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#AA9674]/20 focus:border-[#AA9674] transition-colors text-sm text-[#2C4B62] bg-white placeholder:text-gray-400"
      />
    </div>
  );
}
