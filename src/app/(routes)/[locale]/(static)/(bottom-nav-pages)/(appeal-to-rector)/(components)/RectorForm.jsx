'use client';

import React, { useState } from 'react';
import { Send, CheckCircle, AlertCircle } from 'lucide-react';

const RectorForm = ({ locale, type = 'rector' }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    faculty: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle'); // idle, loading, success, error
  
  const labels = {
    az: {
      firstName: 'Ad',
      lastName: 'Soyad',
      faculty: 'Fakültə',
      email: 'Email',
      phone: 'Nömrə',
      subject: 'Mövzu',
      message: 'Müraciətiniz',
      submit: 'Göndər',
      sending: 'Göndərilir...',
      success: 'Müraciətiniz uğurla göndərildi!',
      error: 'Xəta baş verdi. Zəhmət olmasa yenidən cəhd edin.',
      required: 'Bu sahə tələb olunur',
      invalidEmail: 'Düzgün email daxil edin',
      invalidPhone: 'Düzgün telefon nömrəsi daxil edin',
      intro: type === 'rector' 
        ? 'Hörmətli Tələbələr, əgər Rektora hər hansı bir sualınız, təklifiniz və ya şikayətiniz varsa, müraciətinizi təqdim edə bilərsiniz. Xaiş oluruq, müraciət formasındakı bütün tələb olunan sahələrin tam olaraq doldurulmasını və mətlərinizin aydın şəkildə ifadə etməyiniz təmin edin.'
        : 'Bizimlə əlaqə saxlamaq üçün aşağıdaki formu doldurun.'
    },
    en: {
      firstName: 'First Name',
      lastName: 'Last Name',
      faculty: 'Faculty',
      email: 'Email',
      phone: 'Phone Number',
      subject: 'Subject',
      message: 'Your Message',
      submit: 'Submit',
      sending: 'Sending...',
      success: 'Your message has been sent successfully!',
      error: 'An error occurred. Please try again.',
      required: 'This field is required',
      invalidEmail: 'Please enter a valid email',
      invalidPhone: 'Please enter a valid phone number',
      intro: type === 'rector'
        ? 'Dear Students, if you have any questions, suggestions or complaints for the Rector, you can submit your appeal. Please ensure that all required fields in the appeal form are completed and your requests are clearly expressed.'
        : 'Fill out the form below to contact us.'
    }
  };
  
  const t = labels[locale];
  
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.firstName.trim()) {
      newErrors.firstName = t.required;
    }
    
    if (!formData.lastName.trim()) {
      newErrors.lastName = t.required;
    }
    
    if (!formData.email.trim()) {
      newErrors.email = t.required;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = t.invalidEmail;
    }
    
    if (formData.phone && !/^[\d\s\+\-\(\)]+$/.test(formData.phone)) {
      newErrors.phone = t.invalidPhone;
    }
    
    if (!formData.subject.trim()) {
      newErrors.subject = t.required;
    }
    
    if (!formData.message.trim()) {
      newErrors.message = t.required;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setStatus('loading');
    
    try {
      // TODO: Replace with actual API endpoint
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...formData,
          type,
          locale
        })
      });
      
      if (response.ok) {
        setStatus('success');
        setFormData({
          firstName: '',
          lastName: '',
          faculty: '',
          email: '',
          phone: '',
          subject: '',
          message: ''
        });
        
        // Reset success message after 5 seconds
        setTimeout(() => setStatus('idle'), 5000);
      } else {
        setStatus('error');
        setTimeout(() => setStatus('idle'), 5000);
      }
    } catch (error) {
      console.error('Form submission error:', error);
      setStatus('error');
      setTimeout(() => setStatus('idle'), 5000);
    }
  };
  
  return (
    <div className="bg-white">
      {/* Intro Text */}
      <div className="bg-bg-light p-4 sm:p-6 rounded-xl border-2 border-primary/20 mb-6 sm:mb-8">
        <p className="text-gray-700 text-xs sm:text-sm laptop:text-base leading-relaxed">
          {t.intro}
        </p>
      </div>
      
      {/* Success Message */}
      {status === 'success' && (
        <div className="mb-6 p-4 bg-green-50 border-2 border-green-200 rounded-xl flex items-start gap-3">
          <CheckCircle className="text-green-600 flex-shrink-0 mt-0.5" size={20} />
          <p className="text-green-800 text-sm sm:text-base">{t.success}</p>
        </div>
      )}
      
      {/* Error Message */}
      {status === 'error' && (
        <div className="mb-6 p-4 bg-red-50 border-2 border-red-200 rounded-xl flex items-start gap-3">
          <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
          <p className="text-red-800 text-sm sm:text-base">{t.error}</p>
        </div>
      )}
      
      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4 laptop:space-y-6">
        {/* Name Row */}
        <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
          {/* First Name */}
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
              disabled={status === 'loading'}
            />
            {errors.firstName && (
              <p className="mt-1 text-xs sm:text-sm text-red-600">{errors.firstName}</p>
            )}
          </div>
          
          {/* Last Name */}
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
              disabled={status === 'loading'}
            />
            {errors.lastName && (
              <p className="mt-1 text-xs sm:text-sm text-red-600">{errors.lastName}</p>
            )}
          </div>
        </div>
        
        {/* Faculty */}
        <div>
          <label htmlFor="faculty" className="block laptop:text-sm text-xs font-medium text-gray-700 mb-2">
            {t.faculty}
          </label>
          <input
            type="text"
            id="faculty"
            name="faculty"
            value={formData.faculty}
            onChange={handleChange}
            className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors"
            disabled={status === 'loading'}
          />
        </div>
        
        {/* Contact Row */}
        <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
          {/* Email */}
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
              disabled={status === 'loading'}
            />
            {errors.email && (
              <p className="mt-1 text-xs sm:text-sm text-red-600">{errors.email}</p>
            )}
          </div>
          
          {/* Phone */}
          <div>
            <label htmlFor="phone" className="block laptop:text-sm text-xs font-medium text-gray-700 mb-2">
              {t.phone}
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className={`w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors ${
                errors.phone ? 'border-red-300 bg-red-50' : 'border-gray-200'
              }`}
              disabled={status === 'loading'}
            />
            {errors.phone && (
              <p className="mt-1 text-xs sm:text-sm text-red-600">{errors.phone}</p>
            )}
          </div>
        </div>
        
        {/* Subject */}
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
            disabled={status === 'loading'}
          />
          {errors.subject && (
            <p className="mt-1 text-xs sm:text-sm text-red-600">{errors.subject}</p>
          )}
        </div>
        
        {/* Message */}
        <div>
          <label htmlFor="message" className="block laptop:text-sm text-xs font-medium text-gray-700 mb-2">
            {t.message} <span className="text-red-500">*</span>
          </label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            rows={6}
            className={`w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors resize-none ${
              errors.message ? 'border-red-300 bg-red-50' : 'border-gray-200'
            }`}
            disabled={status === 'loading'}
          />
          {errors.message && (
            <p className="mt-1 text-xs sm:text-sm text-red-600">{errors.message}</p>
          )}
        </div>
        
        {/* Submit Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={status === 'loading'}
            className="w-full sm:w-auto px-6 sm:px-10 py-3 sm:py-3.5 bg-primary text-white font-medium text-sm laptop:text-base hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
          >
            {status === 'loading' ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                {t.sending}
              </>
            ) : (
              <>
                {/* <Send size={18} /> */}
                {t.submit}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default RectorForm;
