'use client';

import { useRouter, useParams } from 'next/navigation';
import { useGetBlogByIdQuery, useUpdateBlogMutation } from '@store/api/blogsApi';
import { useBlogForm } from '@hooks/use-blog-form';
import { NewsFormHeader, LanguageSelector, NewsContentStep } from '@components/admin/news';
import CoverImageUpload from '@components/admin/news/CoverImageUpload';
import TagsInput from '@components/admin/news/TagsInput';
import Button from '@components/admin/ui/Button';
import { ArrowLeft, ArrowRight, Save, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

const BLOG_CATEGORIES = [
  { value: 'academic', label: '📚 Akademik' },
  { value: 'research', label: '🔬 Tədqiqat' },
  { value: 'student_life', label: '🎓 Tələbə həyatı' },
  { value: 'alumni', label: '👥 Məzunlar' },
  { value: 'other', label: '📌 Digər' },
];

export default function EditBlogPage() {
  const router = useRouter();
  const { id } = useParams();
  const { data: blogData, isLoading: isFetching } = useGetBlogByIdQuery(id);
  const [updateBlog, { isLoading: isUpdating }] = useUpdateBlogMutation();
  const form = useBlogForm(blogData);

  const handleSubmit = async () => {
    if (!form.validateStep2()) return;
    try {
      const submitData = form.buildSubmitData();
      await updateBlog({ id, formData: submitData }).unwrap();
      toast.success('Bloq yeniləndi');
      router.push('/admin/dashboard/blogs');
    } catch (error) {
      toast.error(error?.data?.message?.message || error?.data?.message || 'Xəta baş verdi');
    }
  };

  if (isFetching) {
    return (
      <div className="fixed inset-0 z-50 bg-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="animate-spin text-primary" size={40} />
          <p className="text-gray-500 font-medium">Bloq yüklənir...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-white flex flex-col">
      <NewsFormHeader title="Bloqu Redaktə Et" currentStep={form.currentStep} />
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
          <div className="space-y-8 max-w-4xl mx-auto">
            <CoverImageUpload
              preview={form.coverImagePreview}
              onFileChange={form.handleCoverImageChange}
              onRemove={form.removeCoverImage}
            />

            <div>
              <label className="block text-sm font-bold text-secondary mb-2">
                Kateqoriya <span className="text-red-500">*</span>
              </label>
              <select
                value={form.formData.category}
                onChange={(e) => form.updateField('category', e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white text-secondary transition-all outline-none"
              >
                {BLOG_CATEGORIES.map((cat) => (
                  <option key={cat.value} value={cat.value}>{cat.label}</option>
                ))}
              </select>
            </div>

            <TagsInput
              label="Teqlər"
              placeholder="Teq əlavə et və Enter basın"
              items={form.formData.tags}
              inputValue={form.tagInput}
              onInputChange={form.setTagInput}
              onAdd={form.addTag}
              onRemove={form.removeTag}
              variant="primary"
            />
          </div>
        )}
      </div>

      <div className="flex items-center justify-between px-8 py-5 border-t border-gray-100 bg-gray-50/80 backdrop-blur-sm">
        <Button variant="outline" onClick={() => router.push('/admin/dashboard/blogs')}>
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
            <Button onClick={handleSubmit} loading={isUpdating}>
              <Save size={18} className="mr-2" />
              Yenilə
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
