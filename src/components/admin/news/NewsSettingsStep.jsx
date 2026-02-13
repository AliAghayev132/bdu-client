'use client';

import CoverImageUpload from './CoverImageUpload';
import TagsInput from './TagsInput';
import SeoSection from './SeoSection';

const CATEGORIES = [
  { value: 'university', label: '🏛️ Universitet' },
  { value: 'education', label: '📚 Təhsil' },
  { value: 'science', label: '🔬 Elm' },
  { value: 'events', label: '🎉 Tədbirlər' },
  { value: 'other', label: '📌 Digər' },
];

export default function NewsSettingsStep({
  currentLang,
  formData,
  coverImagePreview,
  tagInput,
  keywordInput,
  onCoverImageChange,
  onRemoveCoverImage,
  onCategoryChange,
  onTagInputChange,
  onAddTag,
  onRemoveTag,
  onKeywordInputChange,
  onAddKeyword,
  onRemoveKeyword,
  onMetaTitleChange,
  onMetaDescriptionChange,
}) {
  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <CoverImageUpload
        preview={coverImagePreview}
        onFileChange={onCoverImageChange}
        onRemove={onRemoveCoverImage}
      />

      <div>
        <label className="block text-sm font-bold text-secondary mb-2">
          Kateqoriya <span className="text-red-500">*</span>
        </label>
        <select
          value={formData.category}
          onChange={(e) => onCategoryChange(e.target.value)}
          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white text-secondary transition-all outline-none"
        >
          {CATEGORIES.map((cat) => (
            <option key={cat.value} value={cat.value}>
              {cat.label}
            </option>
          ))}
        </select>
      </div>

      <TagsInput
        label="Teqlər"
        placeholder="Teq əlavə et və Enter basın"
        items={formData.tags}
        inputValue={tagInput}
        onInputChange={onTagInputChange}
        onAdd={onAddTag}
        onRemove={onRemoveTag}
        variant="primary"
      />

      <SeoSection
        currentLang={currentLang}
        metaTitle={formData.seo.metaTitle[currentLang]}
        metaDescription={formData.seo.metaDescription[currentLang]}
        keywords={formData.seo.keywords}
        keywordInput={keywordInput}
        onMetaTitleChange={(val) => onMetaTitleChange(val)}
        onMetaDescriptionChange={(val) => onMetaDescriptionChange(val)}
        onKeywordInputChange={onKeywordInputChange}
        onAddKeyword={onAddKeyword}
        onRemoveKeyword={onRemoveKeyword}
      />
    </div>
  );
}
