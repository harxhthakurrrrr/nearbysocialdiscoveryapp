import React, { useState, useEffect } from 'react';
import TinderCard from 'react-tinder-card';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, X, Info, MapPin, Zap, Loader2 } from 'lucide-react';
import api from '../api/axios';

const Discover = () => {
  const [people, setPeople] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastDirection, setLastDirection] = useState();

  // Fetch potential matches from API
  useEffect(() => {
    fetchPotentialMatches();
  }, []);

  const fetchPotentialMatches = async () => {
    try {
      setLoading(true);
      const res = await api.get('/social/potential-matches?limit=20');
      setPeople(res.data.users);
    } catch (err) {
      console.error('Fetch matches error:', err);
    } finally {
      setLoading(false);
    }
  };

  const swiped = async (direction, user) => {
    if (direction === 'right') {
      // Like
      try {
        const res = await api.post('/social/swipe', {
          target_user_id: user._id,
          action: 'like'
        });
        
        if (res.data.match) {
          alert(`🎉 It's a match with ${user.full_name}!`);
          // Refresh matches list
          fetchPotentialMatches();
        }
      } catch (err) {
        console.error('Swipe error:', err);
      }
    } else if (direction === 'left') {
      // Pass
      await api.post('/social/swipe', {
        target_user_id: user._id,
        action: 'pass'
      });
    }
    
    setLastDirection(direction);
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <Loader2 className="animate-spin text-primary" size={48} />
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center bg-bg-dark px-4 overflow-hidden">
      {people.length > 0 ? (
        <>
          <div className="w-full max-w-sm relative aspect-[3/4]">
            <AnimatePresence>
              {people.map((person) => (
                <TinderCard
                  className="absolute inset-0"
                  key={person._id}
                  onSwipe={(dir) => swiped(dir, person)}
                  onCardLeftScreen={() => console.log('removed')}
                  preventSwipe={['up', 'down']}
                >
                  <div 
                    className="relative w-full h-full rounded-[2rem] overflow-hidden glass-card border border-white/20 cursor-grab"
                    style={{ 
                      backgroundImage: `url(${person.avatar_url || 'https://via.placeholder.com/400x600'})`, 
                      backgroundSize: 'cover', 
                      backgroundPosition: 'center' 
                    }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent"></div>
                    
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <div className="flex items-center gap-2 mb-2">
                        <h2 className="text-3xl font-bold text-white">{person.full_name}, {person.age || 24}</h2>
                        <div className="px-2 py-1 bg-primary text-white rounded-lg text-xs font-bold flex items-center gap-1 shadow-md">
                          <Zap size={12} fill="currentColor" /> {person.distance_km}km
                        </div>
                      </div>
                      <p className="text-gray-100 text-sm mb-4 line-clamp-2">{person.bio}</p>
                      
                      <div className="flex items-center gap-4 text-xs text-gray-400">
                        <span className="flex items-center gap-1"><MapPin size={14} /> Nearby</span>
                        <span className="flex items-center gap-1"><Info size={14} /> Level {person.level || 1}</span>
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
          </div>
        </>
      ) : (
        <div className="text-center">
          <p className="text-gray-400">No more people nearby. Check back later!</p>
        </div>
      )}
    </div>
  );
};

export default Discover;