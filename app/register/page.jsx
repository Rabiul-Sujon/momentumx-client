'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signIn, signUp } from '@/lib/auth-client';
import toast from 'react-hot-toast';
import axios from '@/lib/axios';

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const uploadImage = async () => {
    if (!imageFile) return null;
    const formData = new FormData();
    formData.append('image', imageFile);
    const res = await axios.post('/api/upload', formData);
    return res.data.url;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match!');
      setLoading(false);
      return;
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z]).{6,}$/;
    if (!passwordRegex.test(formData.password)) {
      toast.error('Password must be at least 6 characters with one uppercase and one lowercase letter!');
      setLoading(false);
      return;
    }

    try {
      let imageUrl = '';
      if (imageFile) {
        imageUrl = await uploadImage();
      }

         const { error }=await signUp.email({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        image: imageUrl || '',
        callbackURL: '/login',
      });
       if (error) {
      toast.error(error.message || 'Registration failed!');
      setLoading(false);
      return;
    }

      toast.success('Account created successfully!Please login.');
      router.push('/login');
    } catch (error) {
      toast.error(error.message || 'Registration failed!');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await signIn.social({
        provider: 'google',
        callbackURL: typeof window !== 'undefined' ? window.location.origin : 'https://momentumx-client.vercel.app',
      });
    } catch (error) {
      toast.error('Google login failed!');
    }
  };

  return (
    <div className="flex items-center justify-center py-16 px-4">
      <div className="w-full max-w-md">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center font-black text-black text-lg mx-auto mb-4">
            MX
          </div>
          <h1 className="text-2xl font-black text-white">Create Account</h1>
          <p className="text-neutral text-sm mt-1">Join MomentumX and start your fitness journey</p>
        </div>

        {/* Card */}
        <div className="bg-base-200 border border-base-300 rounded-2xl p-8">

          {/* Google Login */}
          <button
            onClick={handleGoogleLogin}
            className="btn btn-outline w-full rounded-xl mb-6 gap-2 border-base-300 hover:border-primary hover:bg-base-300"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </button>

          {/* Divider */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 h-px bg-base-300"></div>
            <span className="text-neutral text-xs uppercase tracking-wider">or</span>
            <div className="flex-1 h-px bg-base-300"></div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Profile Image */}
            <div className="flex flex-col items-center gap-3 mb-2">
              <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-base-300 bg-base-300 flex items-center justify-center">
                {imagePreview ? (
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-neutral text-2xl">👤</span>
                )}
              </div>
              <label className="cursor-pointer text-primary text-sm hover:underline">
                Upload Profile Picture
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            </div>

            <div>
              <label className="text-sm font-medium text-neutral mb-1.5 block">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="John Doe"
                required
                className="input input-bordered w-full bg-base-300 border-base-300 focus:border-primary rounded-xl text-sm"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-neutral mb-1.5 block">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                required
                className="input input-bordered w-full bg-base-300 border-base-300 focus:border-primary rounded-xl text-sm"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-neutral mb-1.5 block">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
                className="input input-bordered w-full bg-base-300 border-base-300 focus:border-primary rounded-xl text-sm"
              />
              <p className="text-neutral text-xs mt-1">
                Min 6 characters, one uppercase and one lowercase
              </p>
            </div>

            <div>
              <label className="text-sm font-medium text-neutral mb-1.5 block">
                Confirm Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                required
                className="input input-bordered w-full bg-base-300 border-base-300 focus:border-primary rounded-xl text-sm"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary w-full rounded-xl text-black font-bold mt-2"
            >
              {loading ? <span className="loading loading-spinner loading-sm"></span> : 'Create Account'}
            </button>
          </form>

          {/* Login Link */}
          <p className="text-center text-sm text-neutral mt-6">
            Already have an account?{' '}
            <Link href="/login" className="text-primary hover:underline font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}