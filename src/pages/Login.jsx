import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Mail, Lock, ArrowRight, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';

const Login = () => {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-8 rounded-[2.5rem] border border-glass-border shadow-2xl"
        >
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mb-4 shadow-xl shadow-primary/20 animate-pulse-glow">
              <MapPin size={32} className="text-white" />
            </div>
            <h2 className="text-3xl font-bold">Welcome Back</h2>
            <p className="text-gray-400 text-sm mt-1">Discover people around you</p>
          </div>

          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                <input 
                  type="email" 
                  placeholder="name@example.com"
                  className="w-full bg-white/5 border border-glass-border rounded-2xl py-4 pl-12 pr-4 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                <input 
                  type="password" 
                  placeholder="••••••••"
                  className="w-full bg-white/5 border border-glass-border rounded-2xl py-4 pl-12 pr-4 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all"
                />
              </div>
            </div>

            <div className="flex justify-end">
              <button type="button" className="text-xs text-primary font-bold hover:underline">Forgot Password?</button>
            </div>

            <button className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg shadow-primary/20 mt-4 group">
              Sign In
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          <div className="mt-8 flex items-center gap-4">
            <div className="flex-1 h-[1px] bg-glass-border"></div>
            <span className="text-xs text-gray-500 font-bold uppercase">Or continue with</span>
            <div className="flex-1 h-[1px] bg-glass-border"></div>
          </div>

          <div className="mt-6 flex gap-4">
            <button className="flex-1 glass border-glass-border py-3 rounded-2xl flex items-center justify-center gap-2 hover:bg-white/5 transition-all">
              <Globe size={20} />
              <span className="text-sm font-bold">Web</span>
            </button>
            <button className="flex-1 glass border-glass-border py-3 rounded-2xl flex items-center justify-center gap-2 hover:bg-white/5 transition-all">
              <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5" alt="" />
              <span className="text-sm font-bold">Google</span>
            </button>
          </div>

          <p className="text-center text-sm text-gray-400 mt-8">
            Don't have an account? <Link to="/register" className="text-primary font-bold hover:underline">Sign Up</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
