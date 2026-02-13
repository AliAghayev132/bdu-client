'use client';

import { useState, useEffect } from 'react';
import Modal from './ui/Modal';
import Input from './ui/Input';
import Textarea from './ui/Textarea';
import Button from './ui/Button';
import { useCreatePersonMutation, useUpdatePersonMutation } from '@store/api/personsApi';
import { Plus, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function PersonModal({ isOpen, onClose, person, onSuccess }) {
  const [formData, setFormData] = useState({
    slug: { az: '', en: '' },
    name: { az: '', en: '' },
    position: { az: '', en: '' },
    phone: '',
    email: '',
    bio: { az: '', en: '' },
    education: [],
    experience: [],
    awards: [],
    publications: [],
    category: 'leadership',
    order: 0,
    isActive: true,
  });
  const [imageFile, setImageFile] = useState(null);

  const [createPerson, { isLoading: isCreating }] = useCreatePersonMutation();
  const [updatePerson, { isLoading: isUpdating }] = useUpdatePersonMutation();

  useEffect(() => {
    if (person) {
      setFormData({
        slug: person.slug || { az: '', en: '' },
        name: person.name || { az: '', en: '' },
        position: person.position || { az: '', en: '' },
        phone: person.phone || '',
        email: person.email || '',
        bio: person.bio || { az: '', en: '' },
        education: person.education || [],
        experience: person.experience || [],
        awards: person.awards || [],
        publications: person.publications || [],
        category: person.category || 'leadership',
        order: person.order || 0,
        isActive: person.isActive !== undefined ? person.isActive : true,
      });
    } else {
      setFormData({
        slug: { az: '', en: '' },
        name: { az: '', en: '' },
        position: { az: '', en: '' },
        phone: '',
        email: '',
        bio: { az: '', en: '' },
        education: [],
        experience: [],
        awards: [],
        publications: [],
        category: 'leadership',
        order: 0,
        isActive: true,
      });
    }
    setImageFile(null);
  }, [person, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.slug.az || !formData.slug.en) {
      toast.error('Slug hər iki dildə doldurulmalıdır');
      return;
    }
    if (!formData.name.az || !formData.name.en) {
      toast.error('Ad hər iki dildə doldurulmalıdır');
      return;
    }
    if (!formData.position.az || !formData.position.en) {
      toast.error('Vəzifə hər iki dildə doldurulmalıdır');
      return;
    }

    const submitFormData = new FormData();
    submitFormData.append('slug', JSON.stringify(formData.slug));
    submitFormData.append('name', JSON.stringify(formData.name));
    submitFormData.append('position', JSON.stringify(formData.position));
    submitFormData.append('phone', formData.phone);
    submitFormData.append('email', formData.email);
    submitFormData.append('bio', JSON.stringify(formData.bio));
    submitFormData.append('education', JSON.stringify(formData.education));
    submitFormData.append('experience', JSON.stringify(formData.experience));
    submitFormData.append('awards', JSON.stringify(formData.awards));
    submitFormData.append('publications', JSON.stringify(formData.publications));
    submitFormData.append('category', formData.category);
    submitFormData.append('order', formData.order);
    submitFormData.append('isActive', formData.isActive);

    if (imageFile) {
      submitFormData.append('image', imageFile);
    }

    try {
      if (person) {
        await updatePerson({ id: person._id, formData: submitFormData }).unwrap();
        toast.success('Şəxs yeniləndi');
      } else {
        await createPerson(submitFormData).unwrap();
        toast.success('Şəxs yaradıldı');
      }
      onSuccess();
    } catch (error) {
      toast.error(error?.data?.message?.message || 'Xəta baş verdi');
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={person ? 'Şəxsi Redaktə Et' : 'Yeni Şəxs'}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Slug */}
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Slug (AZ)"
            required
            value={formData.slug.az}
            onChange={(e) => setFormData({ ...formData, slug: { ...formData.slug, az: e.target.value } })}
            placeholder="rektor"
          />
          <Input
            label="Slug (EN)"
            required
            value={formData.slug.en}
            onChange={(e) => setFormData({ ...formData, slug: { ...formData.slug, en: e.target.value } })}
            placeholder="rector"
          />
        </div>

        {/* Name */}
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Ad Soyad (AZ)"
            required
            value={formData.name.az}
            onChange={(e) => setFormData({ ...formData, name: { ...formData.name, az: e.target.value } })}
          />
          <Input
            label="Ad Soyad (EN)"
            required
            value={formData.name.en}
            onChange={(e) => setFormData({ ...formData, name: { ...formData.name, en: e.target.value } })}
          />
        </div>

        {/* Position */}
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Vəzifə (AZ)"
            required
            value={formData.position.az}
            onChange={(e) => setFormData({ ...formData, position: { ...formData.position, az: e.target.value } })}
          />
          <Input
            label="Vəzifə (EN)"
            required
            value={formData.position.en}
            onChange={(e) => setFormData({ ...formData, position: { ...formData.position, en: e.target.value } })}
          />
        </div>

        {/* Contact */}
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
          <Input
            label="Telefon"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          />
        </div>

        {/* Bio */}
        <div className="grid grid-cols-2 gap-4">
          <Textarea
            label="Bioqrafiya (AZ)"
            rows={4}
            value={formData.bio.az}
            onChange={(e) => setFormData({ ...formData, bio: { ...formData.bio, az: e.target.value } })}
          />
          <Textarea
            label="Bioqrafiya (EN)"
            rows={4}
            value={formData.bio.en}
            onChange={(e) => setFormData({ ...formData, bio: { ...formData.bio, en: e.target.value } })}
          />
        </div>

        {/* Category & Order */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Kateqoriya</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="leadership">Rəhbərlik</option>
              <option value="faculty">Fakültə</option>
              <option value="staff">Heyət</option>
            </select>
          </div>
          <Input
            label="Sıra"
            type="number"
            value={formData.order}
            onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
          />
        </div>

        {/* Image Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Şəkil</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files[0])}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          />
          {person?.image && !imageFile && (
            <p className="text-xs text-gray-500 mt-1">Mövcud şəkil: {person.image}</p>
          )}
        </div>

        {/* Education Section */}
        <div className="border-t pt-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-gray-700">Təhsil</h3>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => setFormData({
                ...formData,
                education: [...formData.education, { degree: { az: '', en: '' }, institution: { az: '', en: '' }, year: '' }]
              })}
            >
              <Plus size={16} className="mr-1" />
              Əlavə et
            </Button>
          </div>
          {formData.education.map((edu, index) => (
            <div key={index} className="bg-gray-50 p-3 rounded-lg mb-2 space-y-2">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-medium text-gray-600">Təhsil #{index + 1}</span>
                <button
                  type="button"
                  onClick={() => setFormData({
                    ...formData,
                    education: formData.education.filter((_, i) => i !== index)
                  })}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 size={16} />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Input
                  placeholder="Dərəcə (AZ)"
                  value={edu.degree?.az || ''}
                  onChange={(e) => {
                    const newEducation = [...formData.education];
                    newEducation[index].degree = { ...newEducation[index].degree, az: e.target.value };
                    setFormData({ ...formData, education: newEducation });
                  }}
                />
                <Input
                  placeholder="Dərəcə (EN)"
                  value={edu.degree?.en || ''}
                  onChange={(e) => {
                    const newEducation = [...formData.education];
                    newEducation[index].degree = { ...newEducation[index].degree, en: e.target.value };
                    setFormData({ ...formData, education: newEducation });
                  }}
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Input
                  placeholder="Təhsil müəssisəsi (AZ)"
                  value={edu.institution?.az || ''}
                  onChange={(e) => {
                    const newEducation = [...formData.education];
                    newEducation[index].institution = { ...newEducation[index].institution, az: e.target.value };
                    setFormData({ ...formData, education: newEducation });
                  }}
                />
                <Input
                  placeholder="Təhsil müəssisəsi (EN)"
                  value={edu.institution?.en || ''}
                  onChange={(e) => {
                    const newEducation = [...formData.education];
                    newEducation[index].institution = { ...newEducation[index].institution, en: e.target.value };
                    setFormData({ ...formData, education: newEducation });
                  }}
                />
              </div>
              <Input
                placeholder="İl"
                value={edu.year || ''}
                onChange={(e) => {
                  const newEducation = [...formData.education];
                  newEducation[index].year = e.target.value;
                  setFormData({ ...formData, education: newEducation });
                }}
              />
            </div>
          ))}
        </div>

        {/* Experience Section */}
        <div className="border-t pt-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-gray-700">İş Təcrübəsi</h3>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => setFormData({
                ...formData,
                experience: [...formData.experience, { position: { az: '', en: '' }, organization: { az: '', en: '' }, startYear: '', endYear: '' }]
              })}
            >
              <Plus size={16} className="mr-1" />
              Əlavə et
            </Button>
          </div>
          {formData.experience.map((exp, index) => (
            <div key={index} className="bg-gray-50 p-3 rounded-lg mb-2 space-y-2">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-medium text-gray-600">Təcrübə #{index + 1}</span>
                <button
                  type="button"
                  onClick={() => setFormData({
                    ...formData,
                    experience: formData.experience.filter((_, i) => i !== index)
                  })}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 size={16} />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Input
                  placeholder="Vəzifə (AZ)"
                  value={exp.position?.az || ''}
                  onChange={(e) => {
                    const newExperience = [...formData.experience];
                    newExperience[index].position = { ...newExperience[index].position, az: e.target.value };
                    setFormData({ ...formData, experience: newExperience });
                  }}
                />
                <Input
                  placeholder="Vəzifə (EN)"
                  value={exp.position?.en || ''}
                  onChange={(e) => {
                    const newExperience = [...formData.experience];
                    newExperience[index].position = { ...newExperience[index].position, en: e.target.value };
                    setFormData({ ...formData, experience: newExperience });
                  }}
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Input
                  placeholder="Təşkilat (AZ)"
                  value={exp.organization?.az || ''}
                  onChange={(e) => {
                    const newExperience = [...formData.experience];
                    newExperience[index].organization = { ...newExperience[index].organization, az: e.target.value };
                    setFormData({ ...formData, experience: newExperience });
                  }}
                />
                <Input
                  placeholder="Təşkilat (EN)"
                  value={exp.organization?.en || ''}
                  onChange={(e) => {
                    const newExperience = [...formData.experience];
                    newExperience[index].organization = { ...newExperience[index].organization, en: e.target.value };
                    setFormData({ ...formData, experience: newExperience });
                  }}
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Input
                  placeholder="Başlama ili"
                  value={exp.startYear || ''}
                  onChange={(e) => {
                    const newExperience = [...formData.experience];
                    newExperience[index].startYear = e.target.value;
                    setFormData({ ...formData, experience: newExperience });
                  }}
                />
                <Input
                  placeholder="Bitmə ili"
                  value={exp.endYear || ''}
                  onChange={(e) => {
                    const newExperience = [...formData.experience];
                    newExperience[index].endYear = e.target.value;
                    setFormData({ ...formData, experience: newExperience });
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Awards Section */}
        <div className="border-t pt-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-gray-700">Mükafatlar</h3>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => setFormData({
                ...formData,
                awards: [...formData.awards, { title: { az: '', en: '' }, year: '' }]
              })}
            >
              <Plus size={16} className="mr-1" />
              Əlavə et
            </Button>
          </div>
          {formData.awards.map((award, index) => (
            <div key={index} className="bg-gray-50 p-3 rounded-lg mb-2 space-y-2">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-medium text-gray-600">Mükafat #{index + 1}</span>
                <button
                  type="button"
                  onClick={() => setFormData({
                    ...formData,
                    awards: formData.awards.filter((_, i) => i !== index)
                  })}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 size={16} />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Input
                  placeholder="Mükafat adı (AZ)"
                  value={award.title?.az || ''}
                  onChange={(e) => {
                    const newAwards = [...formData.awards];
                    newAwards[index].title = { ...newAwards[index].title, az: e.target.value };
                    setFormData({ ...formData, awards: newAwards });
                  }}
                />
                <Input
                  placeholder="Mükafat adı (EN)"
                  value={award.title?.en || ''}
                  onChange={(e) => {
                    const newAwards = [...formData.awards];
                    newAwards[index].title = { ...newAwards[index].title, en: e.target.value };
                    setFormData({ ...formData, awards: newAwards });
                  }}
                />
              </div>
              <Input
                placeholder="İl"
                value={award.year || ''}
                onChange={(e) => {
                  const newAwards = [...formData.awards];
                  newAwards[index].year = e.target.value;
                  setFormData({ ...formData, awards: newAwards });
                }}
              />
            </div>
          ))}
        </div>

        {/* Publications Section */}
        <div className="border-t pt-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-gray-700">Nəşrlər</h3>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => setFormData({
                ...formData,
                publications: [...formData.publications, { title: { az: '', en: '' }, year: '', type: '' }]
              })}
            >
              <Plus size={16} className="mr-1" />
              Əlavə et
            </Button>
          </div>
          {formData.publications.map((pub, index) => (
            <div key={index} className="bg-gray-50 p-3 rounded-lg mb-2 space-y-2">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-medium text-gray-600">Nəşr #{index + 1}</span>
                <button
                  type="button"
                  onClick={() => setFormData({
                    ...formData,
                    publications: formData.publications.filter((_, i) => i !== index)
                  })}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 size={16} />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Input
                  placeholder="Nəşr adı (AZ)"
                  value={pub.title?.az || ''}
                  onChange={(e) => {
                    const newPublications = [...formData.publications];
                    newPublications[index].title = { ...newPublications[index].title, az: e.target.value };
                    setFormData({ ...formData, publications: newPublications });
                  }}
                />
                <Input
                  placeholder="Nəşr adı (EN)"
                  value={pub.title?.en || ''}
                  onChange={(e) => {
                    const newPublications = [...formData.publications];
                    newPublications[index].title = { ...newPublications[index].title, en: e.target.value };
                    setFormData({ ...formData, publications: newPublications });
                  }}
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Input
                  placeholder="Növ (kitab, məqalə)"
                  value={pub.type || ''}
                  onChange={(e) => {
                    const newPublications = [...formData.publications];
                    newPublications[index].type = e.target.value;
                    setFormData({ ...formData, publications: newPublications });
                  }}
                />
                <Input
                  placeholder="İl"
                  value={pub.year || ''}
                  onChange={(e) => {
                    const newPublications = [...formData.publications];
                    newPublications[index].year = e.target.value;
                    setFormData({ ...formData, publications: newPublications });
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Active Status */}
        <div className="flex items-center gap-2 border-t pt-4">
          <input
            type="checkbox"
            id="isActive"
            checked={formData.isActive}
            onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
            className="w-4 h-4 text-blue-600 rounded"
          />
          <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
            Aktiv
          </label>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 justify-end pt-4">
          <Button variant="outline" onClick={onClose} type="button">
            Ləğv et
          </Button>
          <Button type="submit" loading={isCreating || isUpdating}>
            {person ? 'Yenilə' : 'Yarat'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
