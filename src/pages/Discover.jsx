import React, { useState, useEffect, useRef } from 'react';
import TinderCard from 'react-tinder-card';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, X, Info, MapPin, Zap, Loader2, Sparkles } from 'lucide-react';
import api from '../api/axios';

const Discover = () => {
  const [people, setPeople] = useState([]);
  console.log('People state:', people);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [lastDirection, setLastDirection] = useState('');
  const [matchAlert, setMatchAlert] = useState(null);
  
  // Refs for TinderCard
  const childRefs = useRef([]);

  // Fetch potential matches from API
  useEffect(() => {
    fetchPotentialMatches();
  }, []);

  const fetchPotentialMatches = async () => {
    try {
      setLoading(true);
      const res = await api.get('/social/potential-matches?limit=20');
      console.log('Potential matches:', res.data);
      setPeople(res.data.users || []);
      setCurrentIndex(0);
    } catch (err) {
      console.error('Fetch matches error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Swipe function called by TinderCard
  const swiped = async (direction, user, index) => {
    console.log('Swiped:', direction, user?.full_name);
    
    if (direction === 'right') {
      // LIKE
      try {
        const res = await api.post('/social/swipe', {
          target_user_id: user._id,
          action: 'like'
        });
        
        console.log('Like response:', res.data);
        
        if (res.data.match) {
          setMatchAlert({
            name: user.full_name,
            avatar: user.avatar_url
          });
          setTimeout(() => setMatchAlert(null), 3000);
          // Refresh deck after match
          fetchPotentialMatches();
        }
        setLastDirection('right');
      } catch (err) {
        console.error('Swipe error:', err);
        if (err.response?.status === 400) {
          alert('Already swiped on this user!');
        }
      }
    } else if (direction === 'left') {
      // PASS
      try {
        await api.post('/social/swipe', {
          target_user_id: user._id,
          action: 'pass'
        });
        console.log('Pass recorded');
        setLastDirection('left');
      } catch (err) {
        console.error('Pass error:', err);
      }
    }
    
    // Move to next card
    setCurrentIndex(prev => prev + 1);
  };

  const outOfFrame = (name, index) => {
    console.log(`${name} left the screen!`);
  };

  // 🔥 MANUAL SWIPE FUNCTIONS FOR BUTTONS
  const swipeRight = async () => {
    if (childRefs.current[currentIndex]) {
      await childRefs.current[currentIndex].swipe('right');
    }
  };

  const swipeLeft = async () => {
    if (childRefs.current[currentIndex]) {
      await childRefs.current[currentIndex].swipe('left');
    }
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-bg-dark">
        <Loader2 className="animate-spin text-primary" size={48} />
      </div>
    );
  }

  if (people.length === 0 || currentIndex >= people.length) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center bg-bg-dark p-6 text-center">
        <Sparkles size={64} className="text-gray-500 mb-4 opacity-30" />
        <h2 className="text-2xl font-bold text-white mb-2">No more people nearby</h2>
        <p className="text-gray-400">Check back later for new matches!</p>
        <button 
          onClick={fetchPotentialMatches}
          className="mt-6 px-6 py-2 bg-primary rounded-xl text-white hover:bg-primary/90 transition-all"
        >
          Refresh
        </button>
      </div>
    );
  }

  const currentPerson = people[currentIndex];

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center bg-bg-dark px-4 overflow-hidden">
      
      {/* Match Alert Popup */}
      <AnimatePresence>
        {matchAlert && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-gradient-to-r from-pink-500 to-primary text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3"
          >
            <Heart fill="white" size={20} />
            <span className="font-bold">It's a match with {matchAlert.name}! 🎉</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Swipe Cards Container */}
      <div className="w-full max-w-sm relative aspect-[3/4]">
        {people.map((person, index) => (
          <TinderCard
            ref={el => childRefs.current[index] = el}
            className="absolute inset-0"
            key={person._id}
            onSwipe={(dir) => swiped(dir, person, index)}
            onCardLeftScreen={() => outOfFrame(person.full_name, index)}
            preventSwipe={['up', 'down']}
            swipeRequirementType="velocity"
            swipeThreshold={0.5}
          >
            <div 
              className="relative w-full h-full rounded-[2rem] overflow-hidden glass-card border border-white/20 cursor-grab active:cursor-grabbing shadow-2xl"
              style={{ 
                backgroundImage: `url(${person.avatar_url || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400'})`, 
                backgroundSize: 'cover', 
                backgroundPosition: 'center' 
              }}
            >
              {/* Dark Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
              
              {/* User Info */}
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <div className="flex items-center gap-2 mb-2">
                  <h2 className="text-3xl font-bold">{person.full_name}, {person.age || 24}</h2>
                  <div className="px-2 py-1 bg-primary rounded-lg text-xs font-bold flex items-center gap-1 shadow-md">
                    <Zap size={12} fill="currentColor" /> {person.distance_km || 2.5}km
                  </div>
                </div>
                <p className="text-gray-200 text-sm mb-3 line-clamp-2">{person.bio || "No bio yet"}</p>
                
                <div className="flex items-center gap-4 text-xs text-gray-300">
                  <span className="flex items-center gap-1"><MapPin size={14} /> Nearby</span>
                  <span className="flex items-center gap-1"><Sparkles size={14} /> Level {person.level || 1}</span>
                </div>

                {/* Interests */}
                {person.interests && person.interests.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {person.interests.slice(0, 3).map(interest => (
                      <span key={interest} className="px-2 py-0.5 bg-white/20 rounded-full text-xs">
                        {interest}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </TinderCard>
        ))}
      </div>

      {/* 🔥 SWIPE ACTION BUTTONS - FIXED 🔥 */}
      <div className="flex gap-6 mt-12">
        {/* PASS/REJECT BUTTON */}
        <button 
          onClick={swipeLeft}
          className="w-16 h-16 rounded-full glass flex items-center justify-center text-red-500 border border-red-500/20 hover:bg-red-500/10 hover:scale-110 transition-all active:scale-90"
        >
          <X size={32} />
        </button>
        
        {/* LIKE/ACCEPT BUTTON */}
        <button 
          onClick={swipeRight}
          className="w-20 h-20 rounded-full bg-primary flex items-center justify-center text-white shadow-xl shadow-primary/30 hover:scale-110 transition-all active:scale-90"
        >
          <Heart size={36} fill="white" />
        </button>
      </div>

      {/* Swipe Instruction */}
      {lastDirection && (
        <motion.p 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 text-gray-500 text-sm"
        >
          {lastDirection === 'right' ? '❤️ You liked them!' : '👈 You passed'}
        </motion.p>
      )}

      {/* Empty State Instruction */}
      {!lastDirection && people.length > 0 && (
        <p className="mt-8 text-gray-500 text-xs">
          👉 Tap Heart to Like | 👈 Tap X to Pass
        </p>
      )}
    </div>
  );
};

export default Discover;