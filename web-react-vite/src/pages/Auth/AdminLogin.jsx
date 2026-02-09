import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, User, ShieldCheck } from 'lucide-react';
import useAuthStore from '../../store/authStore';
import { AuthInput, AuthButton, AuthHeader } from '../../components/auth/AuthFormElements';

const AdminLogin = () => {
  const navigate = useNavigate();
  const { login, loading } = useAuthStore();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = await login(formData.email, formData.password);
      if (user && user.role === 'admin') {
        navigate('/admin/dashboard', { replace: true });
      } else if (user) {
        const { logout } = useAuthStore.getState();
        await logout();
        setError('Access denied. Admin credentials required.');
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:20px_20px]">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[440px] bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden"
      >
        <AuthHeader
          title="Administrator Login"
          subtitle="System Management Console"
          icon={ShieldCheck}
          colorClass="bg-slate-900"
        />

        {/* Form Body */}
        <div className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-3.5 bg-red-50 border border-red-100 rounded-lg text-red-600 text-[11px] font-bold uppercase tracking-wider">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <AuthInput
                label="Administrative Email"
                icon={Mail}
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="admin@management.com"
              />

              <AuthInput
                label="System Password"
                icon={Lock}
                type="password"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="••••••••"
              />
            </div>

            <AuthButton
              loading={loading}
              securityText="Protected by enterprise-grade authentication"
            >
              Sign in as Administrator
            </AuthButton>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between">
            <Link
              to="/"
              className="text-[11px] font-black text-slate-400 uppercase tracking-widest transition-colors"
            >
              ← Back to Home
            </Link>
            <Link
              to="/register?role=admin"
              className="text-[11px] font-black text-slate-900 underline underline-offset-4 decoration-2 decoration-blue-100 hover:decoration-blue-500 uppercase tracking-widest transition-all"
            >
              Request Access
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminLogin;
