import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import apiClient from '../api/client';
import { School, ShieldCheck, Lock, Mail, ArrowRight, CheckCircle } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('admin@apex.edu');
  const [password, setPassword] = useState('password123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { setAuth } = useAuthStore();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await apiClient.post('/auth/login', { email, password });
      if (res.data?.success && res.data?.data) {
        setAuth(res.data.data);
        navigate('/');
      } else {
        setError(res.data?.message || 'Login failed');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const setDemoCredentials = (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword('password123');
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Decorative ambient background */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-brand-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-brand-600 to-emerald-400 text-white shadow-xl shadow-brand-500/30 mb-4">
          <School className="w-8 h-8" />
        </div>
        <h2 className="text-3xl font-extrabold tracking-tight text-white">EduSuite ERP</h2>
        <p className="mt-1 text-sm text-slate-400 font-medium">
          Enterprise Multi-Campus Educational Management Platform
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="bg-white py-8 px-6 shadow-2xl rounded-3xl sm:px-10 border border-slate-100">
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Institutional Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@apex.edu"
                  className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-xl focus:border-brand-600 focus:outline-none focus:ring-1 focus:ring-brand-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-xl focus:border-brand-600 focus:outline-none focus:ring-1 focus:ring-brand-600"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-bold text-white bg-brand-600 hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 shadow-md shadow-brand-600/30 transition-all disabled:opacity-50"
            >
              {loading ? 'Authenticating...' : 'Sign In to Portal'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Demo Role Switcher */}
          <div className="mt-6 pt-6 border-t border-slate-100">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block text-center mb-2.5">
              One-Click Demo Roles (Password: password123)
            </span>
            <div className="grid grid-cols-3 gap-1.5 text-xs">
              <button
                type="button"
                onClick={() => setDemoCredentials('admin@apex.edu')}
                className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 font-medium text-slate-700 truncate"
              >
                Super Admin
              </button>
              <button
                type="button"
                onClick={() => setDemoCredentials('principal@apex.edu')}
                className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 font-medium text-slate-700 truncate"
              >
                Principal
              </button>
              <button
                type="button"
                onClick={() => setDemoCredentials('faculty@apex.edu')}
                className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 font-medium text-slate-700 truncate"
              >
                Faculty
              </button>
              <button
                type="button"
                onClick={() => setDemoCredentials('accountant@apex.edu')}
                className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 font-medium text-slate-700 truncate"
              >
                Accountant
              </button>
              <button
                type="button"
                onClick={() => setDemoCredentials('student@apex.edu')}
                className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 font-medium text-slate-700 truncate"
              >
                Student
              </button>
              <button
                type="button"
                onClick={() => setDemoCredentials('parent@apex.edu')}
                className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 font-medium text-slate-700 truncate"
              >
                Parent
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
