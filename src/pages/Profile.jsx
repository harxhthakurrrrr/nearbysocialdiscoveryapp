import React from 'react';
import { motion } from 'framer-motion';
import { Settings, Edit3, Shield, Award, Zap, History, MapPin, Share2 } from 'lucide-react';

const Profile = () => {
  const stats = [
    { label: 'Points', value: '2,450', icon: <Zap size={20} className="text-yellow-400" /> },
    { label: 'Matches', value: '18', icon: <Award size={20} className="text-primary" /> },
    { label: 'Rank', value: '#12', icon: <History size={20} className="text-secondary" /> },
  ];

  const badges = [
    { id: 1, name: 'Early Bird', icon: '🌅', color: 'bg-orange-500/20 text-orange-500' },
    { id: 2, name: 'Socialite', icon: '🤝', color: 'bg-blue-500/20 text-blue-500' },
    { id: 3, name: 'Explorer', icon: '🧭', color: 'bg-green-500/20 text-green-500' },
    { id: 4, name: 'Top 10%', icon: '🏆', color: 'bg-yellow-500/20 text-yellow-500' },
  ];

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-bg-dark pb-12">
      {/* Header Profile */}
      <div className="relative h-64">
        <img 
          src="https://images.unsplash.com/photo-1557683316-973673baf926?w=1000&q=80" 
          className="w-full h-full object-cover"
          alt="Cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-bg-dark to-transparent"></div>
        <div className="absolute top-6 right-6 flex gap-2">
          <button className="p-2 glass rounded-xl text-white hover:bg-white/10 transition-all"><Share2 size={20} /></button>
          <button className="p-2 glass rounded-xl text-white hover:bg-white/10 transition-all"><Settings size={20} /></button>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-6 -mt-20 relative z-10">
        <div className="flex flex-col items-center">
          <div className="relative group">
            <img 
              src="https://api.dicebear.com/7.x/avataaars/svg?seed=Harsh" 
              className="w-32 h-32 rounded-3xl border-4 border-bg-dark shadow-2xl bg-white"
              alt="Profile"
            />
            <button className="absolute bottom-2 right-2 p-2 bg-primary rounded-xl text-white shadow-lg scale-0 group-hover:scale-100 transition-transform">
              <Edit3 size={16} />
            </button>
          </div>
          
          <h2 className="text-3xl font-bold mt-4">Harsh, 21</h2>
          <p className="text-gray-400 flex items-center gap-1 text-sm mt-1">
            <MapPin size={14} /> New Delhi, India
          </p>
          
          <div className="flex gap-4 mt-8 w-full">
            {stats.map((stat, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="flex-1 glass-card p-4 rounded-2xl border border-glass-border flex flex-col items-center gap-2"
              >
                {stat.icon}
                <span className="text-xl font-bold">{stat.value}</span>
                <span className="text-[10px] text-gray-500 uppercase tracking-widest">{stat.label}</span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Gamification / Progress */}
        <div className="mt-10 glass-card p-6 rounded-3xl border border-glass-border">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-lg flex items-center gap-2">
              <Zap size={20} className="text-primary" /> Level 12 Explorer
            </h3>
            <span className="text-xs text-gray-400">2,450 / 3,000 XP</span>
          </div>
          <div className="w-full h-3 bg-white/5 rounded-full overflow-hidden border border-white/5">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: '80%' }}
              transition={{ duration: 1, ease: 'easeOut' }}
              className="h-full bg-gradient-to-r from-primary to-secondary"
            />
          </div>
          <p className="text-xs text-gray-400 mt-3">Earn 550 more XP to unlock <b>Ghost Mode</b>! 👻</p>
        </div>

        {/* Badges */}
        <div className="mt-10">
          <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
            <Award size={20} className="text-secondary" /> Achievement Badges
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {badges.map((badge) => (
              <div key={badge.id} className={`${badge.color} p-4 rounded-2xl flex flex-col items-center gap-2 border border-current opacity-80 hover:opacity-100 transition-opacity`}>
                <span className="text-2xl">{badge.icon}</span>
                <span className="text-[10px] font-bold uppercase tracking-tighter">{badge.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Settings / Privacy */}
        <div className="mt-10 space-y-4">
          <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
            <Shield size={20} className="text-green-500" /> Privacy & Safety
          </h3>
          <div className="glass p-4 rounded-2xl border border-glass-border flex items-center justify-between">
            <div>
              <p className="font-bold text-sm">Ghost Mode</p>
              <p className="text-xs text-gray-500">Go invisible on the map</p>
            </div>
            <div className="w-12 h-6 bg-white/5 rounded-full relative border border-white/10 cursor-not-allowed opacity-50">
              <div className="absolute left-1 top-1 w-4 h-4 bg-gray-500 rounded-full"></div>
            </div>
          </div>
          <div className="glass p-4 rounded-2xl border border-glass-border flex items-center justify-between">
            <div>
              <p className="font-bold text-sm">Blur Location</p>
              <p className="text-xs text-gray-400">Hide your exact spot by default</p>
            </div>
            <div className="w-12 h-6 bg-primary/20 rounded-full relative border border-primary/30 cursor-pointer">
              <div className="absolute right-1 top-1 w-4 h-4 bg-primary rounded-full shadow-lg shadow-primary/50"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
