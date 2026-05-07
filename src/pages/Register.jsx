import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Mail, Lock, ArrowRight, Loader2, AlertCircle, CheckCircle, X } from 'lucide-react';
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
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
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
      
      // Show success modal instead of alert
      setShowSuccessModal(true);
      
      // Auto redirect after 2 seconds
      setTimeout(() => {
        setShowSuccessModal(false);
        navigate('/login');
      }, 2000);
      
    } catch (err) {
      console.error('Registration error:', err);
      
      const errorMessage = 
        err.response?.data?.error ||
        err.response?.data?.message ||
        err.response?.data?.detail ||
        err.message ||
        'Registration failed. Please try again.';
      
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
      {/* Success Modal */}
      <AnimatePresence>
        {showSuccessModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm"
            onClick={() => setShowSuccessModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="glass-card p-8 rounded-3xl max-w-md w-full mx-4 text-center border border-green-500/30"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative">
                <button
                  onClick={() => setShowSuccessModal(false)}
                  className="absolute -top-4 -right-4 p-1 glass rounded-full hover:bg-white/10 transition-colors"
                >
                  <X size={18} />
                </button>
                
                <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center shadow-lg shadow-green-500/20">
                  <CheckCircle size={40} className="text-white" />
                </div>
                
                <h3 className="text-2xl font-bold text-white mb-2">🎉 Registration Successful!</h3>
                <p className="text-gray-300 mb-2">
                  Welcome <span className="text-primary font-bold">{formData.full_name}</span>!
                </p>
                <p className="text-sm text-gray-400 mb-4">
                  Your account has been created successfully.
                </p>
                <div className="flex items-center justify-center gap-2 text-primary text-sm">
                  <Loader2 size={14} className="animate-spin" />
                  Redirecting to login page...
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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