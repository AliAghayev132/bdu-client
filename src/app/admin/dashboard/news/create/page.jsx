'use client';

import { useRouter } from 'next/navigation';
import { useCreateNewsMutation } from '@store/api/newsApi';
import { useNewsForm } from '@hooks/use-news-form';
import { NewsFormHeader, LanguageSelector, NewsContentStep, NewsSettingsStep } from '@components/admin/news';
import Button from '@components/admin/ui/Button';
import { ArrowLeft, ArrowRight, Save } from 'lucide-react';
import toast from 'react-hot-toast';

export default function CreateNewsPage() {
  const router = useRouter();
  const [createNews, { isLoading }] = useCreateNewsMutation();

  const form = useNewsForm();

  const handleSubmit = async () => {
    if (!form.validateStep2()) return;

    try {
      const submitData = form.buildSubmitData();
      await createNews(submitData).unwrap();
      toast.success('Xəbər yaradıldı');
      router.push('/admin/dashboard/news');
    } catch (error) {
      toast.error(error?.data?.message || 'Xəta baş verdi');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-white flex flex-col">
      <NewsFormHeader title="Yeni Xəbər Yarat" currentStep={form.currentStep} />
      <LanguageSelector currentLang={form.currentLang} onChange={form.setCurrentLang} />

      <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
        {form.currentStep === 1 ? (
          <NewsContentStep
            currentLang={form.currentLang}
            title={form.formData.title[form.currentLang]}
            excerpt={form.formData.excerpt[form.currentLang]}
            content={form.formData.content[form.currentLang]}
            onTitleChange={(val) => form.updateLocalizedField('title', form.currentLang, val)}
            onExcerptChange={(val) => form.updateLocalizedField('excerpt', form.currentLang, val)}
            onContentChange={(html) => form.updateLocalizedField('content', form.currentLang, html)}
            onImageUpload={form.handleImageUpload}
          />
        ) : (
          <NewsSettingsStep
            currentLang={form.currentLang}
            formData={form.formData}
            coverImagePreview={form.coverImagePreview}
            tagInput={form.tagInput}
            keywordInput={form.keywordInput}
            onCoverImageChange={form.handleCoverImageChange}
            onRemoveCoverImage={form.removeCoverImage}
            onCategoryChange={(val) => form.updateField('category', val)}
            onTagInputChange={form.setTagInput}
            onAddTag={form.addTag}
            onRemoveTag={form.removeTag}
            onKeywordInputChange={form.setKeywordInput}
            onAddKeyword={form.addKeyword}
            onRemoveKeyword={form.removeKeyword}
            onMetaTitleChange={(val) => form.updateSeoField('metaTitle', form.currentLang, val)}
            onMetaDescriptionChange={(val) => form.updateSeoField('metaDescription', form.currentLang, val)}
          />
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between px-8 py-5 border-t border-gray-100 bg-gray-50/80 backdrop-blur-sm">
        <Button variant="outline" onClick={() => router.push('/admin/dashboard/news')}>
          Ləğv et
        </Button>
        <div className="flex items-center gap-3">
          {form.currentStep === 2 && (
            <Button variant="secondary" onClick={form.goBack}>
              <ArrowLeft size={18} className="mr-2" />
              Geri
            </Button>
          )}
          {form.currentStep === 1 ? (
            <Button onClick={form.goNext}>
              Növbəti
              <ArrowRight size={18} className="ml-2" />
            </Button>
          ) : (
            <Button onClick={handleSubmit} loading={isLoading}>
              <Save size={18} className="mr-2" />
              Yarat
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
