'use client';

import React, { useState } from 'react';
import { CheckCircle, AlertCircle } from 'lucide-react';

const ContactForm = ({ locale, type = 'contact' }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    subject: '',
    message: ''
  });

  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle'); // idle, loading, success, error
  const [isLoading, setIsLoading] = useState(false);

  const labels = {
    az: {
      firstName: 'Ad',
      lastName: 'Soyad',
      email: 'Email',
      phone: 'Nömrə',
      subject: 'Mövzu',
      message: 'Mesajınız',
      submit: 'Göndər',
      sending: 'Göndərilir...',
      success: 'Mesajınız uğurla göndərildi! ',
      error: 'Xəta baş verdi. Zəhmət olmasa yenidən cəhd edin.',
      required: 'Bu sahə tələb olunur',
      invalidEmail: 'Düzgün email daxil edin',
      invalidPhone: 'Düzgün telefon nömrəsi daxil edin',
      intro: 'Bizimlə əlaqə saxlamaq üçün formu doldurun.'
    },
    en: {
      firstName: 'First Name',
      lastName: 'Last Name',
      email: 'Email',
      phone: 'Phone Number',
      subject: 'Subject',
      message: 'Your Message',
      submit: 'Send',
      sending: 'Sending...',
      success: 'Your message has been sent successfully! ',
      error: 'An error occurred. Please try again.',
      required: 'This field is required',
      invalidEmail: 'Please enter a valid email',
      invalidPhone: 'Please enter a valid phone number',
      intro: 'Fill out the form to contact us.'
    }
  };

  const t = labels[locale] ?? labels.en;

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) newErrors.firstName = t.required;
    if (!formData.lastName.trim()) newErrors.lastName = t.required;

    if (!formData.email.trim()) newErrors.email = t.required;
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = t.invalidEmail;

    if (!formData.phoneNumber.trim()) newErrors.phoneNumber = t.required;
    else if (!/^[\d\s\+\-\(\)]+$/.test(formData.phoneNumber)) newErrors.phoneNumber = t.invalidPhone;

    if (!formData.subject.trim()) newErrors.subject = t.required;
    if (!formData.message.trim()) newErrors.message = t.required;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setStatus('loading');

    try {
      const response = await fetch('http://localhost:3001/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setStatus('success');
        setFormData({ firstName: '', lastName: '', email: '', phoneNumber: '', subject: '', message: '' });
        setTimeout(() => setStatus('idle'), 5000);
      } else {
        setStatus('error');
        setTimeout(() => setStatus('idle'), 5000);
      }
    } catch (err) {
      console.error('Contact form error:', err);
      setStatus('error');
      setTimeout(() => setStatus('idle'), 5000);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white">
      <div className="bg-bg-light p-4 sm:p-6 rounded-xl border-2 border-primary/20 mb-6 sm:mb-8">
        <p className="text-gray-700 text-xs sm:text-sm laptop:text-base leading-relaxed">{t.intro}</p>
      </div>

      {status === 'success' && (
        <div className="mb-6 p-4 bg-green-50 border-2 border-green-200 rounded-xl flex items-start gap-3">
          <CheckCircle className="text-green-600 flex-shrink-0 mt-0.5" size={20} />
          <p className="text-green-800 text-sm sm:text-base">{t.success}</p>
        </div>
      )}

      {status === 'error' && (
        <div className="mb-6 p-4 bg-red-50 border-2 border-red-200 rounded-xl flex items-start gap-3">
          <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
          <p className="text-red-800 text-sm sm:text-base">{t.error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 laptop:space-y-6">
        <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
          <div>
            <label htmlFor="firstName" className="block laptop:text-sm text-xs font-medium text-gray-700 mb-2">
              {t.firstName} <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className={`w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors ${
                errors.firstName ? 'border-red-300 bg-red-50' : 'border-gray-200'
              }`}
              disabled={isLoading}
            />
            {errors.firstName && <p className="mt-1 text-xs sm:text-sm text-red-600">{errors.firstName}</p>}
          </div>

          <div>
            <label htmlFor="lastName" className="block laptop:text-sm text-xs font-medium text-gray-700 mb-2">
              {t.lastName} <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className={`w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors ${
                errors.lastName ? 'border-red-300 bg-red-50' : 'border-gray-200'
              }`}
              disabled={isLoading}
            />
            {errors.lastName && <p className="mt-1 text-xs sm:text-sm text-red-600">{errors.lastName}</p>}
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
          <div>
            <label htmlFor="email" className="block laptop:text-sm text-xs font-medium text-gray-700 mb-2">
              {t.email} <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors ${
                errors.email ? 'border-red-300 bg-red-50' : 'border-gray-200'
              }`}
              disabled={isLoading}
            />
            {errors.email && <p className="mt-1 text-xs sm:text-sm text-red-600">{errors.email}</p>}
          </div>

          <div>
            <label htmlFor="phoneNumber" className="block laptop:text-sm text-xs font-medium text-gray-700 mb-2">
              {t.phone} <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              id="phoneNumber"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              className={`w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors ${
                errors.phoneNumber ? 'border-red-300 bg-red-50' : 'border-gray-200'
              }`}
              disabled={isLoading}
            />
            {errors.phoneNumber && <p className="mt-1 text-xs sm:text-sm text-red-600">{errors.phoneNumber}</p>}
          </div>
        </div>

        <div>
          <label htmlFor="subject" className="block laptop:text-sm text-xs font-medium text-gray-700 mb-2">
            {t.subject} <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="subject"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            className={`w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors ${
              errors.subject ? 'border-red-300 bg-red-50' : 'border-gray-200'
            }`}
            disabled={isLoading}
          />
          {errors.subject && <p className="mt-1 text-xs sm:text-sm text-red-600">{errors.subject}</p>}
        </div>

        <div>
          <label htmlFor="message" className="block laptop:text-sm text-xs font-medium text-gray-700 mb-2">
            {t.message} <span className="text-red-500">*</span>
          </label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            rows={3}
            className={`w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors resize-none ${
              errors.message ? 'border-red-300 bg-red-50' : 'border-gray-200'
            }`}
            disabled={isLoading}
          />
          {errors.message && <p className="mt-1 text-xs sm:text-sm text-red-600">{errors.message}</p>}
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-lg sm:w-auto px-6 sm:px-12 py-2.5 sm:py-3 bg-primary text-white font-medium text-sm laptop:text-base hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                {t.sending}
              </>
            ) : (
              <>
                {t.submit}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ContactForm;
