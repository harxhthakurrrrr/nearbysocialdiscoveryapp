import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Lock, ArrowRight, Loader2, AlertCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    full_name: '',
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear errors when typing
    if (error) setError('');
    if (fieldErrors[name]) {
      setFieldErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.username.trim()) {
      errors.username = 'Username is required';
    } else if (formData.username.length < 3) {
      errors.username = 'Username must be at least 3 characters';
    }
    
    if (!formData.full_name.trim()) {
      errors.full_name = 'Full name is required';
    }
    
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Please enter a valid email';
    }
    
    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }
    
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    setError('');

    try {
      const res = await api.post('/auth/register', {
        username: formData.username,
        full_name: formData.full_name,
        email: formData.email,
        password: formData.password,
      });

      console.log('Registration success:', res.data);
      
      // Show success and redirect
      alert('Registration successful! Please login.');
      navigate('/login');
      
    } catch (err) {
      console.error('Registration error:', err);
      
      // 🔥 IMPORTANT: Handle different error formats from backend
      const errorMessage = 
        err.response?.data?.error ||      // Backend sends "error"
        err.response?.data?.message ||     // Backend sends "message"
        err.response?.data?.detail ||      // Backend sends "detail"
        err.message ||                      // Network error
        'Registration failed. Please try again.';
      
      // 🔥 Specific error messages based on content
      if (errorMessage.toLowerCase().includes('username')) {
        setFieldErrors(prev => ({ ...prev, username: errorMessage }));
        setError('');
      } else if (errorMessage.toLowerCase().includes('email')) {
        setFieldErrors(prev => ({ ...prev, email: errorMessage }));
        setError('');
      } else if (errorMessage.toLowerCase().includes('password')) {
        setFieldErrors(prev => ({ ...prev, password: errorMessage }));
        setError('');
      } else {
        setError(errorMessage);
      }
      
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-8 rounded-[2.5rem] border border-glass-border"
        >
          <div className="flex flex-col items-center mb-8">
            <div className="relative group mb-4">
              <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full group-hover:bg-primary/30 transition-all"></div>
              <img 
                src="/icons.svg" 
                className="w-16 h-16 relative z-10 animate-pulse-glow"
                alt="Logo"
              />
            </div>
            <h2 className="text-3xl font-bold mt-4">Create Account</h2>
            <p className="text-gray-400 text-sm mt-1">Join the community today</p>
          </div>

          {/* Global Error Message */}
          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-500 text-sm text-center flex items-center justify-center gap-2"
            >
              <AlertCircle size={18} />
              {error}
            </motion.div>
          )}

          <form className="space-y-4" onSubmit={handleRegister}>
            <div className="grid grid-cols-2 gap-4">
              {/* Username Field */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Username</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                  <input 
                    type="text" 
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    placeholder="john_doe"
                    className={`w-full bg-white/5 border rounded-2xl py-4 pl-12 pr-4 text-sm focus:outline-none focus:border-primary transition-all ${
                      fieldErrors.username ? 'border-red-500' : 'border-glass-border'
                    }`}
                  />
                </div>
                {fieldErrors.username && (
                  <p className="text-xs text-red-500 ml-1">{fieldErrors.username}</p>
                )}
              </div>

              {/* Full Name Field */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Full Name</label>
                <input 
                  type="text" 
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleInputChange}
                  placeholder="John Doe"
                  className={`w-full bg-white/5 border rounded-2xl py-4 px-4 text-sm focus:outline-none focus:border-primary transition-all ${
                    fieldErrors.full_name ? 'border-red-500' : 'border-glass-border'
                  }`}
                />
                {fieldErrors.full_name && (
                  <p className="text-xs text-red-500 ml-1">{fieldErrors.full_name}</p>
                )}
              </div>
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                <input 
                  type="email" 
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="name@example.com"
                  className={`w-full bg-white/5 border rounded-2xl py-4 pl-12 pr-4 text-sm focus:outline-none focus:border-primary transition-all ${
                    fieldErrors.email ? 'border-red-500' : 'border-glass-border'
                  }`}
                />
              </div>
              {fieldErrors.email && (
                <p className="text-xs text-red-500 ml-1">{fieldErrors.email}</p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                <input 
                  type="password" 
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="••••••••"
                  className={`w-full bg-white/5 border rounded-2xl py-4 pl-12 pr-4 text-sm focus:outline-none focus:border-primary transition-all ${
                    fieldErrors.password ? 'border-red-500' : 'border-glass-border'
                  }`}
                />
              </div>
              {fieldErrors.password && (
                <p className="text-xs text-red-500 ml-1">{fieldErrors.password}</p>
              )}
              <p className="text-[10px] text-gray-500 ml-1">Password must be at least 6 characters</p>
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-95 mt-2 group disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  Creating account...
                </>
              ) : (
                <>
                  Get Started
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <p className="text-center text-sm text-gray-400 mt-8">
            Already have an account?{' '}
            <Link to="/login" className="text-primary font-bold hover:underline">
              Sign In
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Register;