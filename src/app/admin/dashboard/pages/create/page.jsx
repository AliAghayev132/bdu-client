'use client';

// Next.js
import { useRouter } from 'next/navigation';

// API
import { useCreatePageMutation } from '@store/api/pagesApi';

// Hooks
import { usePageForm } from '@hooks/use-page-form';

// UI Components
import { Button, Input, Textarea } from '@components/admin/ui';
import dynamic from 'next/dynamic';

// Icons
import { ArrowLeft, ArrowRight, Save, X } from 'lucide-react';

// Utilities
import toast from 'react-hot-toast';

const TiptapEditor = dynamic(() => import('@components/admin/editor/TiptapEditor'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-96">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-secondary"></div>
    </div>
  ),
});

export default function CreatePagePage() {
  const router = useRouter();
  const [createPage, { isLoading }] = useCreatePageMutation();
  const form = usePageForm();

  const handleSubmit = async () => {
    if (!form.validateStep1()) return;

    try {
      const submitData = form.buildSubmitData();
      await createPage(submitData).unwrap();
      toast.success('Səhifə yaradıldı');
      router.push('/admin/dashboard/pages');
    } catch (error) {
      toast.error(error?.data?.message || 'Xəta baş verdi');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-white flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-8 py-5 border-b border-gray-100 bg-white">
        <div className="flex items-center gap-6">
          <h2 className="text-2xl font-bold text-secondary font-montserrat">
            Yeni Səhifə Yarat
          </h2>
          <div className="flex items-center gap-3 text-sm font-medium">
            <span className={`px-4 py-1.5 rounded-full transition-colors ${
              form.currentStep === 1
                ? 'bg-primary/10 text-primary border border-primary/20'
                : 'bg-gray-100 text-gray-500'
            }`}>
              1. Məzmun
            </span>
            <span className="text-gray-300">→</span>
            <span className={`px-4 py-1.5 rounded-full transition-colors ${
              form.currentStep === 2
                ? 'bg-primary/10 text-primary border border-primary/20'
                : 'bg-gray-100 text-gray-500'
            }`}>
              2. SEO
            </span>
          </div>
        </div>
        <button
          onClick={() => router.push('/admin/dashboard/pages')}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400 hover:text-secondary"
        >
          <X size={24} />
        </button>
      </div>

      {/* Language Selector */}
      <div className="flex items-center justify-end gap-3 px-8 py-4 border-b border-gray-100 bg-gray-50/50">
        <span className="text-sm font-semibold text-secondary">Dil seçimi:</span>
        <div className="flex gap-2">
          {['az', 'en'].map((lang) => (
            <button
              key={lang}
              onClick={() => form.setCurrentLang(lang)}
              className={`px-4 py-2 rounded-lg font-bold text-sm transition-all shadow-sm ${
                form.currentLang === lang
                  ? 'bg-secondary text-white ring-2 ring-secondary ring-offset-2'
                  : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              {lang === 'az' ? '🇦🇿 AZ' : '🇬🇧 EN'}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
        {form.currentStep === 1 ? (
          <div className="space-y-8">
            <Input
              label={`Path/URL (${form.currentLang.toUpperCase()})`}
              required
              value={form.formData.path[form.currentLang]}
              onChange={(e) => form.updateLocalizedField('path', form.currentLang, e.target.value)}
              placeholder="/haqqimizda"
              className="font-mono"
            />

            <Input
              label={`Başlıq (${form.currentLang.toUpperCase()})`}
              required
              value={form.formData.title[form.currentLang]}
              onChange={(e) => form.updateLocalizedField('title', form.currentLang, e.target.value)}
              placeholder="Səhifə başlığı"
              className="text-lg"
            />

            <Textarea
              label={`Təsvir (${form.currentLang.toUpperCase()})`}
              rows={3}
              value={form.formData.description[form.currentLang]}
              onChange={(e) => form.updateLocalizedField('description', form.currentLang, e.target.value)}
              placeholder="Səhifənin qısa təsviri"
            />

            <div>
              <label className="block text-sm font-bold text-secondary mb-3">
                Səhifə Növü
              </label>
              <select
                value={form.formData.pageType}
                onChange={(e) => form.updateField('pageType', e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white text-secondary outline-none transition-all"
              >
                <option value="static">📄 Statik</option>
                <option value="card">🎴 Kart</option>
                <option value="blog">📝 Bloq</option>
                <option value="list">📋 Siyahı</option>
                <option value="custom">⚙️ Xüsusi</option>
                <option value="personPage">👥 Şəxslər</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-secondary mb-3">
                Məzmun ({form.currentLang.toUpperCase()})
              </label>
              <div className="border border-gray-200 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all">
                <TiptapEditor
                  content={form.formData.content[form.currentLang]}
                  onChange={(html) => form.updateLocalizedField('content', form.currentLang, html)}
                  onImageUpload={form.handleImageUpload}
                  minHeight={400}
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-8 max-w-4xl mx-auto">
            <Input
              label={`Meta Başlıq (${form.currentLang.toUpperCase()})`}
              value={form.formData.seo.metaTitle[form.currentLang]}
              onChange={(e) => form.updateSeoField('metaTitle', form.currentLang, e.target.value)}
              placeholder="SEO üçün meta başlıq"
            />

            <Textarea
              label={`Meta Təsvir (${form.currentLang.toUpperCase()})`}
              rows={3}
              value={form.formData.seo.metaDescription[form.currentLang]}
              onChange={(e) => form.updateSeoField('metaDescription', form.currentLang, e.target.value)}
              placeholder="SEO üçün meta təsvir"
            />

            <div>
              <label className="block text-sm font-bold text-secondary mb-3">Açar Sözlər</label>
              <div className="flex gap-2 mb-3">
                <Input
                  value={form.keywordInput}
                  onChange={(e) => form.setKeywordInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), form.addKeyword())}
                  placeholder="Açar söz əlavə et və Enter basın"
                  className="flex-1"
                />
                <Button type="button" onClick={form.addKeyword} variant="outline">
                  Əlavə et
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {form.formData.seo.keywords.map((keyword) => (
                  <span
                    key={keyword}
                    className="px-3 py-1.5 bg-primary/10 text-primary rounded-lg text-sm font-medium flex items-center gap-2 border border-primary/20"
                  >
                    {keyword}
                    <button
                      onClick={() => form.removeKeyword(keyword)}
                      className="hover:text-red-500 transition-colors"
                    >
                      <X size={14} />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <Input
              label="OG Image URL"
              value={form.formData.seo.ogImage}
              onChange={(e) => form.updateSeoSimpleField('ogImage', e.target.value)}
              placeholder="https://example.com/image.jpg"
            />
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between px-8 py-5 border-t border-gray-100 bg-gray-50/80 backdrop-blur-sm">
        <Button variant="outline" onClick={() => router.push('/admin/dashboard/pages')}>
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
