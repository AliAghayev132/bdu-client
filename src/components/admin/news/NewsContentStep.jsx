'use client';

import dynamic from 'next/dynamic';
import Input from '@components/admin/ui/Input';
import Textarea from '@components/admin/ui/Textarea';

const TiptapEditor = dynamic(() => import('@components/admin/editor/TiptapEditor'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-96">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-secondary"></div>
    </div>
  ),
});

export default function NewsContentStep({
  currentLang,
  title,
  excerpt,
  content,
  onTitleChange,
  onExcerptChange,
  onContentChange,
  onImageUpload,
}) {
  return (
    <div className="space-y-8">
      <Input
        label={`Başlıq (${currentLang.toUpperCase()})`}
        required
        value={title}
        onChange={(e) => onTitleChange(e.target.value)}
        placeholder="Xəbər başlığı"
        className="text-lg"
      />

      <Textarea
        label={`Qısa məzmun (${currentLang.toUpperCase()})`}
        rows={3}
        value={excerpt}
        onChange={(e) => onExcerptChange(e.target.value)}
        placeholder="Xəbərin qısa təsviri"
      />

      <div>
        <label className="block text-sm font-bold text-secondary mb-3">
          Məzmun ({currentLang.toUpperCase()}) <span className="text-red-500">*</span>
        </label>
        <div className="border border-gray-200 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all">
          <TiptapEditor
            content={content}
            onChange={onContentChange}
            onImageUpload={onImageUpload}
            minHeight={500}
          />
        </div>
      </div>
    </div>
  );
}
