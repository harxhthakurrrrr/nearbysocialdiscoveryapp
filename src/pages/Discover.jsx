import React, { useState } from 'react';
import TinderCard from 'react-tinder-card';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, X, Info, MapPin, Zap } from 'lucide-react';

const Discover = () => {
  const [people, setPeople] = useState([
    { id: 1, name: 'Priya', age: 22, bio: 'Love traveling and photography! 📸', img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500', distance: '1.5km' },
    { id: 2, name: 'Arjun', age: 25, bio: 'Foodie and fitness enthusiast 🍔🏋️', img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500', distance: '3km' },
    { id: 3, name: 'Neha', age: 23, bio: 'Coding is life. Let\'s build something! 💻', img: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500', distance: '500m' },
    { id: 4, name: 'Vikram', age: 26, bio: 'Music producer and DJ 🎧', img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500', distance: '2.1km' },
  ]);

  const [lastDirection, setLastDirection] = useState();

  const swiped = (direction, nameToDelete) => {
    setLastDirection(direction);
  };

  const outOfFrame = (name) => {
    console.log(name + ' left the screen!');
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center bg-bg-dark px-4 overflow-hidden">
      <div className="w-full max-w-sm relative aspect-[3/4]">
        <AnimatePresence>
          {people.map((person) => (
            <TinderCard
              className="absolute inset-0"
              key={person.id}
              onSwipe={(dir) => swiped(dir, person.name)}
              onCardLeftScreen={() => outOfFrame(person.name)}
              preventSwipe={['up', 'down']}
            >
              <div 
                className="relative w-full h-full rounded-[2rem] overflow-hidden glass-card border border-white/20 cursor-grab active:cursor-grabbing"
                style={{ backgroundImage: `url(${person.img})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent"></div>
                
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <div className="flex items-center gap-2 mb-2">
                    <h2 className="text-3xl font-bold text-white">{person.name}, {person.age}</h2>
                    <div className="px-2 py-1 bg-primary text-white rounded-lg text-xs font-bold border border-primary/30 flex items-center gap-1 shadow-md">
                      <Zap size={12} fill="currentColor" /> {person.distance}
                    </div>
                  </div>
                  <p className="text-gray-100 text-sm mb-4 line-clamp-2">{person.bio}</p>
                  
                  <div className="flex items-center gap-4 text-xs text-gray-400">
                    <span className="flex items-center gap-1"><MapPin size={14} /> New Delhi</span>
                    <span className="flex items-center gap-1"><Info size={14} /> View Profile</span>
                  </div>
                </div>
              </div>
            </TinderCard>
          ))}
        </AnimatePresence>
      </div>

      {/* Swipe Actions */}
      <div className="flex gap-6 mt-12">
        <button className="w-16 h-16 rounded-full glass flex items-center justify-center text-red-500 border border-red-500/20 hover:bg-red-500/10 transition-all active:scale-90">
          <X size={32} />
        </button>
        <button className="w-20 h-20 rounded-full bg-primary flex items-center justify-center text-white shadow-xl shadow-primary/30 hover:scale-110 transition-all active:scale-90">
          <Heart size={36} fill="white" />
        </button>
        <button className="w-16 h-16 rounded-full glass flex items-center justify-center text-blue-500 border border-blue-500/20 hover:bg-blue-500/10 transition-all active:scale-90">
          <Info size={32} />
        </button>
      </div>

      {lastDirection && (
        <motion.p 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 text-gray-500 font-medium"
        >
          You swiped {lastDirection}
        </motion.p>
      )}
    </div>
  );
};

export default Discover;
