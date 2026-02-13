'use client';

import Input from '@components/admin/ui/Input';
import Textarea from '@components/admin/ui/Textarea';
import TagsInput from './TagsInput';

export default function SeoSection({
  currentLang,
  metaTitle,
  metaDescription,
  keywords,
  keywordInput,
  onMetaTitleChange,
  onMetaDescriptionChange,
  onKeywordInputChange,
  onAddKeyword,
  onRemoveKeyword,
}) {
  return (
    <div className="border-t border-gray-100 pt-8">
      <h3 className="text-lg font-bold text-secondary mb-6">SEO Parametrləri</h3>
      <div className="space-y-6">
        <Input
          label={`Meta Başlıq (${currentLang.toUpperCase()})`}
          value={metaTitle}
          onChange={(e) => onMetaTitleChange(e.target.value)}
          placeholder="SEO üçün meta başlıq"
        />

        <Textarea
          label={`Meta Təsvir (${currentLang.toUpperCase()})`}
          rows={2}
          value={metaDescription}
          onChange={(e) => onMetaDescriptionChange(e.target.value)}
          placeholder="SEO üçün meta təsvir"
        />

        <TagsInput
          label="Açar sözlər"
          placeholder="Açar söz əlavə et və Enter basın"
          items={keywords}
          inputValue={keywordInput}
          onInputChange={onKeywordInputChange}
          onAdd={onAddKeyword}
          onRemove={onRemoveKeyword}
          variant="secondary"
        />
      </div>
    </div>
  );
}
