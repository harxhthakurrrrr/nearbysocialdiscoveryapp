import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Settings, Edit3, Shield, Award, Zap, History, MapPin, Share2, Loader2, X, Check, Camera } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import { useParams } from 'react-router-dom';

const Profile = () => {
  const { id } = useParams();
  const { user: currentUser } = useAuth();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [ghostMode, setGhostMode] = useState(() => {
    return localStorage.getItem('ghostMode') === 'true';
  });
  const [editForm, setEditForm] = useState({
    full_name: '',
    bio: '',
    interests: '',
    mood_status: ''
  });

  // Check if viewing own profile or other user's profile
  const isOwnProfile = !id || (currentUser?._id === id);

  useEffect(() => {
    if (id && !isOwnProfile) {
      fetchUserById(id);
    } else {
      fetchMyProfile();
    }
  }, [id]);

  const fetchUserById = async (userId) => {
    try {
      setLoading(true);
      const res = await api.get(`/auth/profile/${userId}`);
      setUser(res.data.user);
    } catch (err) {
      console.error('Fetch user by id error:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchMyProfile = async () => {
    try {
      setLoading(true);
      const res = await api.get('/auth/me');
      setUser(res.data.user);
      setEditForm({
        full_name: res.data.user.full_name || '',
        bio: res.data.user.bio || '',
        interests: res.data.user.interests?.join(', ') || '',
        mood_status: res.data.user.mood_status || ''
      });
    } catch (err) {
      console.error('Fetch profile error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    setSuccessMsg('');
    
    try {
      const updateData = {
        full_name: editForm.full_name,
        bio: editForm.bio,
        interests: editForm.interests.split(',').map(i => i.trim()).filter(i => i),
        mood_status: editForm.mood_status
      };
      
      const res = await api.put('/auth/profile', updateData);
      setUser(res.data.user);
      setIsEditing(false);
      setSuccessMsg('Profile updated successfully!');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      console.error('Update profile error:', err);
      alert(err.response?.data?.error || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const toggleGhostMode = () => {
    const newMode = !ghostMode;
    setGhostMode(newMode);
    localStorage.setItem('ghostMode', newMode);
    alert(newMode ? '👻 Ghost Mode ON - You are invisible on the map' : '👁️ Ghost Mode OFF - You are visible on the map');
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <Loader2 className="animate-spin text-primary" size={48} />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <p className="text-gray-400">User not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-bg-dark pb-12">
      {/* Cover Photo */}
      <div className="relative h-64">
        <img 
          src="https://images.unsplash.com/photo-1557683316-973673baf926?w=1000&q=80" 
          className="w-full h-full object-cover"
          alt="Cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-bg-dark to-transparent"></div>
        
        {/* Action Buttons - Only for own profile */}
        {isOwnProfile && (
          <div className="absolute top-6 right-6 flex gap-2">
            <button className="p-2 glass rounded-xl text-white hover:bg-white/10 transition-all">
              <Share2 size={20} />
            </button>
            <button 
              onClick={() => setIsEditing(!isEditing)}
              className="p-2 glass rounded-xl text-white hover:bg-primary/20 hover:text-primary transition-all"
            >
              <Settings size={20} />
            </button>
          </div>
        )}
      </div>

      <div className="max-w-2xl mx-auto px-6 -mt-20 relative z-10">
        {/* Profile Avatar */}
        <div className="flex flex-col items-center">
          <div className="relative group">
            <img 
              src={user?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.username}`} 
              className="w-32 h-32 rounded-3xl border-4 border-bg-dark shadow-2xl bg-white object-cover"
              alt="Profile"
            />
            {isOwnProfile && (
              <button className="absolute bottom-2 right-2 p-2 bg-primary rounded-xl text-white shadow-lg scale-0 group-hover:scale-100 transition-transform">
                <Camera size={16} />
              </button>
            )}
          </div>
          
          <h2 className="text-3xl font-bold mt-4">{user?.full_name}, {user?.age || 21}</h2>
          <p className="text-gray-400 flex items-center gap-1 text-sm mt-1">
            <MapPin size={14} /> @{user?.username}
          </p>
          
          {/* Stats Cards */}
          <div className="flex gap-4 mt-8 w-full">
            <div className="flex-1 glass-card p-4 rounded-2xl border border-glass-border flex flex-col items-center gap-2">
              <Zap size={20} className="text-yellow-400" />
              <span className="text-xl font-bold">{user?.xp_points || 0}</span>
              <span className="text-[10px] text-gray-500 uppercase">Points</span>
            </div>
            <div className="flex-1 glass-card p-4 rounded-2xl border border-glass-border flex flex-col items-center gap-2">
              <Award size={20} className="text-primary" />
              <span className="text-xl font-bold">{user?.level || 1}</span>
              <span className="text-[10px] text-gray-500 uppercase">Level</span>
            </div>
            <div className="flex-1 glass-card p-4 rounded-2xl border border-glass-border flex flex-col items-center gap-2">
              <History size={20} className="text-secondary" />
              <span className="text-xl font-bold">{user?.streak_days || 0}</span>
              <span className="text-[10px] text-gray-500 uppercase">Streak</span>
            </div>
          </div>
        </div>

        {/* Success Message */}
        {successMsg && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 p-4 bg-green-500/10 border border-green-500/20 rounded-2xl text-green-500 text-sm text-center flex items-center justify-center gap-2"
          >
            <Check size={18} />
            {successMsg}
          </motion.div>
        )}

        {/* Edit Profile Form - Only for own profile */}
        {isOwnProfile && isEditing && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-8 glass-card p-6 rounded-3xl border border-glass-border"
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <Edit3 size={20} className="text-primary" />
                Edit Profile
              </h3>
              <button 
                onClick={() => setIsEditing(false)}
                className="p-2 hover:bg-white/10 rounded-xl transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Full Name</label>
                <input 
                  type="text"
                  name="full_name"
                  value={editForm.full_name}
                  onChange={handleEditChange}
                  className="w-full mt-1 bg-white/5 border border-glass-border rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-primary transition-all"
                  placeholder="Enter your full name"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Bio</label>
                <textarea 
                  name="bio"
                  value={editForm.bio}
                  onChange={handleEditChange}
                  rows="3"
                  placeholder="Tell something about yourself..."
                  className="w-full mt-1 bg-white/5 border border-glass-border rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-primary transition-all resize-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                  Interests (comma separated)
                </label>
                <input 
                  type="text"
                  name="interests"
                  value={editForm.interests}
                  onChange={handleEditChange}
                  placeholder="Travel, Music, Sports, Photography"
                  className="w-full mt-1 bg-white/5 border border-glass-border rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-primary transition-all"
                />
                <p className="text-[10px] text-gray-500 mt-1">Example: Travel, Music, Sports</p>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Mood Status</label>
                <select 
                  name="mood_status"
                  value={editForm.mood_status}
                  onChange={handleEditChange}
                  className="w-full mt-1 bg-white/5 border border-glass-border rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-primary transition-all"
                >
                  <option value="">Select your mood</option>
                  <option value="Adventurous">Adventurous 🏔️</option>
                  <option value="Chill">Chill 😎</option>
                  <option value="Social">Social 🎉</option>
                  <option value="Working">Working 💻</option>
                  <option value="Traveling">Traveling ✈️</option>
                  <option value="Foodie">Foodie 🍕</option>
                  <option value="Gaming">Gaming 🎮</option>
                </select>
              </div>

              <div className="flex gap-3 pt-4">
                <button 
                  onClick={() => setIsEditing(false)}
                  className="flex-1 py-3 glass rounded-xl font-bold hover:bg-white/10 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSaveProfile}
                  disabled={saving}
                  className="flex-1 bg-primary hover:bg-primary/90 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                >
                  {saving ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Check size={18} />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* XP Progress Bar */}
        <div className="mt-10 glass-card p-6 rounded-3xl border border-glass-border">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-lg flex items-center gap-2">
              <Zap size={20} className="text-primary" /> Level {user?.level || 1} Explorer
            </h3>
            <span className="text-xs text-gray-400">{user?.xp_points || 0} / {((user?.level || 1) * 1000)} XP</span>
          </div>
          <div className="w-full h-3 bg-white/5 rounded-full overflow-hidden border border-white/5">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${((user?.xp_points || 0) % 1000) / 10}%` }}
              className="h-full bg-gradient-to-r from-primary to-secondary"
            />
          </div>
          <p className="text-xs text-gray-400 mt-3">
            Earn {((user?.level || 1) * 1000) - (user?.xp_points || 0)} more XP to reach Level {(user?.level || 1) + 1}
          </p>
        </div>

        {/* Bio & Interests Display */}
        <div className="mt-10">
          {user?.bio && (
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">About</h3>
              <p className="text-gray-200">{user.bio}</p>
            </div>
          )}
          
          {user?.interests && user.interests.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">Interests</h3>
              <div className="flex flex-wrap gap-2">
                {user.interests.map(interest => (
                  <span key={interest} className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs text-gray-300">
                    {interest}
                  </span>
                ))}
              </div>
            </div>
          )}

          {user?.mood_status && (
            <div className="mt-6">
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">Mood</h3>
              <span className="px-3 py-1 bg-primary/20 border border-primary/30 rounded-full text-xs text-primary">
                {user.mood_status}
              </span>
            </div>
          )}
        </div>

        {/* Privacy Settings - Only for own profile */}
        {isOwnProfile && (
          <div className="mt-10 space-y-4">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
              <Shield size={20} className="text-green-500" /> Privacy & Safety
            </h3>
            
            {/* Ghost Mode Toggle - WORKING */}
            <div className="glass p-4 rounded-2xl border border-glass-border flex items-center justify-between">
              <div>
                <p className="font-bold text-sm">👻 Ghost Mode</p>
                <p className="text-xs text-gray-500">Go invisible on the map</p>
              </div>
              <button 
                onClick={toggleGhostMode}
                className={`relative w-12 h-6 rounded-full transition-all ${ghostMode ? 'bg-primary' : 'bg-gray-600'}`}
              >
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${ghostMode ? 'right-1' : 'left-1'}`} />
              </button>
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
        )}
      </div>
    </div>
  );
};

export default Profile;