export default function Input({ 
  label, 
  error, 
  className = '', 
  required = false,
  ...props 
}) {
  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-[#2C4B62] mb-1">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <input
        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#AA9674]/20 focus:border-[#AA9674] transition-colors text-[#2C4B62] ${
          error ? 'border-red-500' : 'border-gray-200'
        }`}
        {...props}
      />
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
}
