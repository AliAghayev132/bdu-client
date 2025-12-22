'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLoginMutation } from '@store/api/authApi';
import { useDispatch } from 'react-redux';
import { setCredentials } from '@store/slices/authSlice';
import Button from '@components/admin/ui/Button';
import Input from '@components/admin/ui/Input';
import toast from 'react-hot-toast';
import { LogIn } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [login, { isLoading }] = useLoginMutation();
  
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4">
            <LogIn className="text-white" size={32} />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">BDU Admin</h1>
          <p className="text-gray-600 mt-2">İdarəetmə panelinə daxil olun</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="İstifadəçi adı"
            type="text"
            required
            value={formData.username}
            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            placeholder="admin"
          />

          <Input
            label="Şifrə"
            type="password"
            required
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            placeholder="••••••••"
          />

          <Button
            type="submit"
            className="w-full"
            loading={isLoading}
            disabled={isLoading}
          >
            Daxil ol
          </Button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          © 2024 Bakı Dövlət Universiteti
        </p>
      </div>
    </div>
  );
}
