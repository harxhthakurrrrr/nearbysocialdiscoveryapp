import React from 'react';
import { motion } from 'framer-motion';
import { Heart, MessageCircle, MapPin, Search } from 'lucide-react';

const Matches = () => {
  const matches = [
    { id: 1, name: 'Priya', age: 22, img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500', time: '2h ago' },
    { id: 2, name: 'Neha', age: 23, img: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500', time: '5h ago' },
    { id: 3, name: 'Sneha', age: 24, img: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=500', time: 'Yesterday' },
  ];

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-bg-dark p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold">Your Matches</h2>
            <p className="text-gray-400 text-sm">People who liked you back!</p>
          </div>
          <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary border border-primary/20">
            <Heart size={24} fill="currentColor" />
          </div>
        </div>

        {/* New Matches Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          <div className="aspect-[3/4] rounded-3xl border-2 border-dashed border-glass-border flex flex-col items-center justify-center gap-3 group cursor-pointer hover:border-primary/50 transition-all">
            <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
              <Search size={24} className="text-gray-500 group-hover:text-primary" />
            </div>
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest group-hover:text-primary">Discover More</p>
          </div>
          
          {matches.map((match, idx) => (
            <motion.div 
              key={match.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.1 }}
              className="relative aspect-[3/4] rounded-3xl overflow-hidden group cursor-pointer"
            >
              <img src={match.img} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" alt="" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-4 group-hover:translate-y-0 transition-transform">
                <h3 className="font-bold text-white text-lg">{match.name}, {match.age}</h3>
                <p className="text-[10px] text-gray-400 mb-3 flex items-center gap-1">
                  <MapPin size={10} /> {match.time}
                </p>
                <div className="flex gap-2">
                  <button className="flex-1 bg-primary py-2 rounded-xl text-white flex items-center justify-center">
                    <MessageCircle size={16} />
                  </button>
                  <button className="p-2 glass rounded-xl text-white">
                    <Heart size={16} fill="white" />
                  </button>
                </div>
              </div>
              <div className="absolute top-3 right-3 w-3 h-3 bg-green-500 border-2 border-bg-dark rounded-full"></div>
            </motion.div>
          ))}
        </div>

        {/* Empty State / Tips */}
        <div className="glass-card p-8 rounded-[2.5rem] border border-glass-border text-center">
          <div className="max-w-xs mx-auto">
            <h3 className="text-lg font-bold mb-2">Want more matches?</h3>
            <p className="text-sm text-gray-400 mb-6">Users with completed profiles get 3x more matches in their area.</p>
            <button className="bg-white/5 hover:bg-white/10 text-white font-bold py-3 px-6 rounded-2xl border border-white/10 transition-all active:scale-95">
              Complete Your Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Matches;
