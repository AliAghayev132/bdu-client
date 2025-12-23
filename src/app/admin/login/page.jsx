'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLoginMutation } from '@store/api/authApi';
import { useDispatch } from 'react-redux';
import { setCredentials } from '@store/slices/authSlice';
import toast from 'react-hot-toast';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import Image from 'next/image';

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [login, { isLoading }] = useLoginMutation();
  
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);

  const validateInput = (input) => {
    // Prevent common injection patterns
    const injectionPatterns = [
      /(\.\.\/)/, // Directory traversal
      /(<script>)/i, // XSS
      /(javascript:)/i, // XSS
      /(')/, // SQL injection single quote
      /(";)/, // SQL injection
    ];

    for (const pattern of injectionPatterns) {
      if (pattern.test(input)) return false;
    }
    return true;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (validateInput(value)) {
      setFormData(prev => ({ ...prev, [name]: value }));
    } else {
      toast.error('Girişdə qadağan olunmuş simvollar var!');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Strict username validation before submit
    const usernameRegex = /^[a-zA-Z0-9._-]+$/;
    if (!usernameRegex.test(formData.username)) {
      toast.error('İstifadəçi adı yalnız hərflər, rəqəmlər, nöqtə, alt xətt və defisdən ibarət ola bilər.');
      return;
    }

    try {
      const result = await login(formData).unwrap();
      dispatch(setCredentials({ 
        user: result.admin, 
        token: result.accessToken 
      }));
      toast.success('Uğurla daxil oldunuz');
      router.push('/admin/dashboard');
    } catch (error) {
      toast.error(error?.data?.message || 'Giriş uğursuz oldu');
    }
  };

  return (
    <div className="flex min-h-screen w-full">
      {/* Left Side - Image (Hidden on Mobile) */}
      <div className="hidden lg:flex lg:w-3/5 relative bg-[#2C4B62] overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/bdu-login-bg.png"
            alt="Baku State University"
            fill
            className="object-cover opacity-60 mix-blend-overlay"
            priority
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#2C4B62]/90 to-transparent z-10" />
        
        <div className="relative z-20 w-full h-full flex flex-col justify-end p-16 text-white">
          <h1 className="text-5xl font-bold font-montserrat mb-6">Administrativ Panel</h1>
          <p className="text-xl opacity-90 max-w-xl leading-relaxed">
            Bakı Dövlət Universitetinin rəsmi idarəetmə paneli.
          </p>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex w-full lg:w-2/5 flex-col justify-center px-8 lg:px-16 bg-white">
        <div className="w-full max-w-[400px] mx-auto space-y-8">
          
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="flex justify-center mb-6">
              <Image 
                src="/bsu-logo.png" 
                alt="BDU Logo" 
                width={100} 
                height={100} 
                className="object-contain"
              />
            </div>
            <h2 className="text-3xl font-bold text-[#2C4B62] font-montserrat">Xoş Gəlmisiniz</h2>
            <p className="text-gray-500">Davam etmək üçün hesabınıza daxil olun</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-[#2C4B62]" htmlFor="username">
                İstifadəçi adı
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                value={formData.username}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#AA9674] focus:ring-2 focus:ring-[#AA9674]/20 transition-all outline-none bg-gray-50 text-[#2C4B62]"
                placeholder="İstifadəçi adı daxil edin"
              />
            </div>

            <div className="space-y-2">
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#AA9674] focus:ring-2 focus:ring-[#AA9674]/20 transition-all outline-none bg-gray-50 text-[#2C4B62]"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#2C4B62] transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 px-4 bg-[#2C4B62] hover:bg-[#233b4d] text-white font-semibold rounded-xl transition-all transform active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  <span>Daxil olunur...</span>
                </>
              ) : (
                <span>Daxil ol</span>
              )}
            </button>
          </form>

          <div className="text-center pt-4">
            <p className="text-xs text-gray-400">
              © 2025 Bakı Dövlət Universiteti. Bütün hüquqlar qorunur.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
