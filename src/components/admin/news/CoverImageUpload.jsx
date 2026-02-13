'use client';

import { X } from 'lucide-react';

export default function CoverImageUpload({ preview, onFileChange, onRemove }) {
  return (
    <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
      <label className="block text-sm font-bold text-secondary mb-4">
        Əsas Şəkil <span className="text-red-500">*</span>
      </label>
      <div className="flex items-start gap-6">
        <div className="flex-1">
          <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-xl cursor-pointer bg-white hover:bg-gray-50 hover:border-primary transition-all">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <p className="text-sm text-gray-500">
                <span className="font-semibold text-primary">Yükləmək üçün toxunun</span>
              </p>
              <p className="text-xs text-gray-400">PNG, JPG (MAX. 5MB)</p>
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={onFileChange}
              className="hidden"
            />
          </label>
        </div>
        {preview && (
          <div className="relative w-48 h-32 rounded-xl overflow-hidden shadow-md border border-gray-200 group">
            <img src={preview} alt="Preview" className="w-full h-full object-cover" />
            <button
              type="button"
              onClick={onRemove}
              className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X className="text-white" size={24} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
