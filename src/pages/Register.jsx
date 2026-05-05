import React from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Lock, ArrowRight, MapPin, Camera } from 'lucide-react';
import { Link } from 'react-router-dom';

const Register = () => {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-8 rounded-[2.5rem] border border-glass-border shadow-2xl"
        >
          <div className="flex flex-col items-center mb-8 shadow-none">
            <div className="relative group mb-4">
              <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full group-hover:bg-primary/30 transition-all"></div>
              <img 
                src="/icons.svg" 
                className="w-16 h-16 relative z-10 animate-pulse-glow"
                alt="Logo"
              />
            </div>
            <h2 className="text-3xl font-bold mt-4 shadow-none">Create Account</h2>
            <p className="text-gray-400 text-sm mt-1 shadow-none">Join the community today</p>
          </div>

          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Full Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                  <input 
                    type="text" 
                    placeholder="Harsh"
                    className="w-full bg-white/5 border border-glass-border rounded-2xl py-4 pl-12 pr-4 text-sm focus:outline-none focus:border-primary transition-all"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Age</label>
                <input 
                  type="number" 
                  placeholder="21"
                  className="w-full bg-white/5 border border-glass-border rounded-2xl py-4 px-4 text-sm focus:outline-none focus:border-primary transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                <input 
                  type="email" 
                  placeholder="name@example.com"
                  className="w-full bg-white/5 border border-glass-border rounded-2xl py-4 pl-12 pr-4 text-sm focus:outline-none focus:border-primary transition-all"
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
                  className="w-full bg-white/5 border border-glass-border rounded-2xl py-4 pl-12 pr-4 text-sm focus:outline-none focus:border-primary transition-all"
                />
              </div>
            </div>

            <div className="flex items-center gap-2 px-1 py-2">
              <input type="checkbox" className="rounded border-glass-border bg-white/5 text-primary focus:ring-primary" />
              <p className="text-[10px] text-gray-400 leading-tight">
                I agree to the <span className="text-primary font-bold">Terms of Service</span> and <span className="text-primary font-bold">Privacy Policy</span>.
              </p>
            </div>

            <button className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg shadow-primary/20 mt-2 group">
              Get Started
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          <p className="text-center text-sm text-gray-400 mt-8">
            Already have an account? <Link to="/login" className="text-primary font-bold hover:underline">Sign In</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Register;
