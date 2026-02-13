'use client';

import { useRouter } from 'next/navigation';
import { useCreateEventMutation } from '@store/api/eventsApi';
import { useEventForm } from '@hooks/use-event-form';
import { NewsFormHeader, LanguageSelector, CoverImageUpload, TagsInput, SeoSection } from '@components/admin/news';
import Input from '@components/admin/ui/Input';
import Textarea from '@components/admin/ui/Textarea';
import Button from '@components/admin/ui/Button';
import { ArrowLeft, ArrowRight, Save } from 'lucide-react';
import toast from 'react-hot-toast';
import dynamic from 'next/dynamic';

const TiptapEditor = dynamic(() => import('@components/admin/editor/TiptapEditor'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-96">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-secondary"></div>
    </div>
  ),
});

const EVENT_CATEGORIES = [
  { value: 'conference', label: '🎤 Konfrans' },
  { value: 'seminar', label: '📚 Seminar' },
  { value: 'workshop', label: '🛠️ Workshop' },
  { value: 'ceremony', label: '🎓 Mərasim' },
  { value: 'competition', label: '🏆 Müsabiqə' },
  { value: 'other', label: '📌 Digər' },
];

export default function CreateEventPage() {
  const router = useRouter();
  const [createEvent, { isLoading }] = useCreateEventMutation();
  const form = useEventForm();

  const handleSubmit = async () => {
    if (!form.validateStep2()) return;
    try {
      const submitData = form.buildSubmitData();
      await createEvent(submitData).unwrap();
      toast.success('Tədbir yaradıldı');
      router.push('/admin/dashboard/events');
    } catch (error) {
      toast.error(error?.data?.message || 'Xəta baş verdi');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-white flex flex-col">
      <NewsFormHeader title="Yeni Tədbir Yarat" currentStep={form.currentStep} />
      <LanguageSelector currentLang={form.currentLang} onChange={form.setCurrentLang} />

      <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
        {form.currentStep === 1 ? (
          <div className="space-y-8 max-w-5xl mx-auto">
            <Input
              label={`Başlıq (${form.currentLang.toUpperCase()})`}
              required
              value={form.formData.title[form.currentLang]}
              onChange={(e) => form.updateLocalizedField('title', form.currentLang, e.target.value)}
              placeholder="Tədbir başlığı"
              className="text-lg"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Input
                label="Tədbir Tarixi"
                type="date"
                required
                value={form.formData.eventDate}
                onChange={(e) => form.updateField('eventDate', e.target.value)}
              />
              <Input
                label="Tədbir Saatı"
                type="time"
                value={form.formData.eventTime}
                onChange={(e) => form.updateField('eventTime', e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Input
                label={`Yer (${form.currentLang.toUpperCase()})`}
                value={form.formData.location[form.currentLang]}
                onChange={(e) => form.updateLocalizedField('location', form.currentLang, e.target.value)}
                placeholder="Tədbir yeri"
              />
              <Input
                label={`Təşkilatçı (${form.currentLang.toUpperCase()})`}
                value={form.formData.organizer[form.currentLang]}
                onChange={(e) => form.updateLocalizedField('organizer', form.currentLang, e.target.value)}
                placeholder="Təşkilatçı adı"
              />
            </div>

            <Textarea
              label={`Qısa məzmun (${form.currentLang.toUpperCase()})`}
              rows={3}
              value={form.formData.excerpt[form.currentLang]}
              onChange={(e) => form.updateLocalizedField('excerpt', form.currentLang, e.target.value)}
              placeholder="Tədbirın qısa təsviri"
            />

            <div>
              <label className="block text-sm font-bold text-secondary mb-3">
                Məzmun ({form.currentLang.toUpperCase()}) <span className="text-red-500">*</span>
              </label>
              <div className="border border-gray-200 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all">
                <TiptapEditor
                  content={form.formData.content[form.currentLang]}
                  onChange={(html) => form.updateLocalizedField('content', form.currentLang, html)}
                  onImageUpload={form.handleImageUpload}
                  minHeight={500}
                />
              </div>
            </div>
          </div>
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
                {EVENT_CATEGORIES.map((cat) => (
                  <option key={cat.value} value={cat.value}>{cat.label}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex items-center h-full">
                <label className="flex items-center gap-3 cursor-pointer p-4 border border-gray-200 rounded-xl w-full hover:bg-gray-50 transition-colors">
                  <input
                    type="checkbox"
                    checked={form.formData.registrationRequired}
                    onChange={(e) => form.updateField('registrationRequired', e.target.checked)}
                    className="w-5 h-5 text-primary rounded focus:ring-primary border-gray-300"
                  />
                  <span className="font-medium text-secondary">Qeydiyyat tələb olunur</span>
                </label>
              </div>
              <Input
                label="İştirakçı sayı"
                type="number"
                value={form.formData.capacity}
                onChange={(e) => form.updateField('capacity', e.target.value)}
                placeholder="Maksimum iştirakçı sayı"
              />
            </div>

            {form.formData.registrationRequired && (
              <Input
                label="Qeydiyyat linki"
                type="url"
                value={form.formData.registrationLink}
                onChange={(e) => form.updateField('registrationLink', e.target.value)}
                placeholder="https://..."
              />
            )}

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

            <SeoSection
              currentLang={form.currentLang}
              metaTitle={form.formData.seo.metaTitle[form.currentLang]}
              metaDescription={form.formData.seo.metaDescription[form.currentLang]}
              keywords={form.formData.seo.keywords}
              keywordInput={form.keywordInput}
              onMetaTitleChange={(val) => form.updateSeoField('metaTitle', form.currentLang, val)}
              onMetaDescriptionChange={(val) => form.updateSeoField('metaDescription', form.currentLang, val)}
              onKeywordInputChange={form.setKeywordInput}
              onAddKeyword={form.addKeyword}
              onRemoveKeyword={form.removeKeyword}
            />
          </div>
        )}
      </div>

      <div className="flex items-center justify-between px-8 py-5 border-t border-gray-100 bg-gray-50/80 backdrop-blur-sm">
        <Button variant="outline" onClick={() => router.push('/admin/dashboard/events')}>
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
