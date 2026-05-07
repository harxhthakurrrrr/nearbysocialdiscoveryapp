import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Navigation, Loader2, Flame, Map as MapIcon, Send, Users } from 'lucide-react';
import api from '../api/axios';
import { useNotifications } from '../features/notifications/NotificationContext';
import HeatmapLayer from '../features/map/HeatmapLayer';
import PulseModal from '../features/map/PulseModal';
import ProfileModal from '../components/ProfileModal';

// Fix marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom avatar marker with pulse animation
const getAvatarIcon = (avatarUrl, username, hasPulse = false) => {
  return L.divIcon({
    html: `
      <div class="custom-avatar-marker" style="position: relative; cursor: pointer;">
        <img src="${avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`}" 
             style="width: 44px; height: 44px; border-radius: 50%; border: 3px solid ${hasPulse ? '#ff0080' : '#7928ca'}; box-shadow: 0 2px 10px rgba(0,0,0,0.15); background: white; object-fit: cover;" />
        <div class="${hasPulse ? 'pulse-ring-active' : 'pulse-ring'}" style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 60px; height: 60px; background: ${hasPulse ? 'rgba(255, 0, 128, 0.4)' : 'rgba(121, 40, 202, 0.2)'}; border-radius: 50%; z-index: -1;"></div>
      </div>`,
    className: 'custom-marker',
    iconSize: [44, 44],
    popupAnchor: [0, -22]
  });
};

const ChangeView = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    if (center) map.flyTo(center, 15);
  }, [center]);
  return null;
};

const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return (R * c).toFixed(2);
};

const Home = () => {
  const { addNotification } = useNotifications();
  const [center, setCenter] = useState([28.6139, 77.2090]);
  const [loading, setLoading] = useState(true);
  const [nearbyUsers, setNearbyUsers] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [showPulseModal, setShowPulseModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [distanceLine, setDistanceLine] = useState(null);

  // Welcome notification
  useEffect(() => {
    const welcomeTimer = setTimeout(() => {
      if (addNotification) {
        addNotification("Nearby social mode active! 🔥", "success");
      }
    }, 1500);
    return () => clearTimeout(welcomeTimer);
  }, [addNotification]);

  const updateLocation = async (lat, lng) => {
    const ghostMode = localStorage.getItem('ghostMode') === 'true';
    if (ghostMode) return;
    
    try {
      await api.post('/location/update', { lat, lng, radius_km: 10 });
    } catch (err) {
      console.error('Location update error:', err);
    }
  };

  // Watch user location
  useEffect(() => {
    const watchId = navigator.geolocation.watchPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        const newCenter = [latitude, longitude];
        
        if (!userLocation) setCenter(newCenter);
        setUserLocation(newCenter);
        await updateLocation(latitude, longitude);
        
        try {
          const res = await api.get('/location/nearby?radius_km=10');
          setNearbyUsers(res.data.users || []);
        } catch (err) {
          console.error('Fetch nearby users error:', err);
        }
        
        setLoading(false);
      },
      (err) => {
        console.error('Geolocation error:', err);
        setLoading(false);
      },
      { enableHighAccuracy: true, maximumAge: 5000 }
    );
    
    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  // Update distance line when user is selected
  useEffect(() => {
    if (selectedUser && userLocation) {
      setDistanceLine([
        [userLocation[0], userLocation[1]],
        [selectedUser.lat, selectedUser.lng]
      ]);
    } else {
      setDistanceLine(null);
    }
  }, [selectedUser, userLocation]);

  const handleMarkerClick = (user) => {
    const distance = calculateDistance(userLocation[0], userLocation[1], user.lat, user.lng);
    setSelectedUser({ ...user, distance_km: distance });
  };

  const handleRecenter = () => {
    if (userLocation) {
      setCenter(userLocation);
      addNotification("Centered on your location! 📍", "info");
    }
  };

  const openPulseModal = () => {
    setShowPulseModal(true);
  };

  return (
    <div className="relative h-[calc(100vh-4rem)] w-full overflow-hidden">
      <style>{`
        @keyframes pulse-anim {
          0% { transform: translate(-50%, -50%) scale(1); opacity: 0.7; }
          100% { transform: translate(-50%, -50%) scale(2); opacity: 0; }
        }
        .pulse-ring { animation: pulse-anim 2s infinite; }
        .pulse-ring-active { animation: pulse-anim 1s infinite; }
        .custom-marker { background: transparent; border: none; }
        .leaflet-container { background: #f8fafc !important; }
      `}</style>

      {/* Loading Screen */}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm z-50">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="animate-spin text-primary" size={48} />
            <p className="text-gray-500 font-medium animate-pulse">Finding nearby friends...</p>
          </div>
        </div>
      )}

      {/* Map Container */}
      <MapContainer center={center} zoom={15} className="h-full w-full">
        <ChangeView center={center} />
        <TileLayer 
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
        />

        {/* Heatmap Layer */}
        <HeatmapLayer points={nearbyUsers} active={showHeatmap} />

        {/* User's Own Marker */}
        {userLocation && (
          <Marker 
            position={userLocation} 
            icon={getAvatarIcon(null, 'you')}
            eventHandlers={{ click: () => addNotification("You are here! 📍", "info") }}
          >
            <Popup>You are here</Popup>
          </Marker>
        )}

        {/* Distance Line */}
        {distanceLine && (
          <Polyline 
            positions={distanceLine}
            pathOptions={{ color: '#ff0080', weight: 2, dashArray: '5, 10', opacity: 0.6 }}
          />
        )}

        {/* Nearby Users */}
        {nearbyUsers.map((user) => (
          <Marker
            key={user._id}
            position={[user.lat, user.lng]}
            icon={getAvatarIcon(user.avatar_url, user.username, user.mood_status)}
            eventHandlers={{ click: () => handleMarkerClick(user) }}
          >
            <Popup>
              <div className="text-center p-1">
                <img src={user.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`} 
                     className="w-10 h-10 rounded-full mx-auto mb-1" />
                <p className="font-bold text-sm">{user.full_name}</p>
                <p className="text-xs text-gray-500">{user.distance_km} km away</p>
                {user.mood_status && (
                  <p className="text-xs text-primary mt-1">💬 {user.mood_status}</p>
                )}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Map Controls - Right Side */}
      <div className="absolute top-6 right-6 z-[1000] flex flex-col gap-3">
        <button
          onClick={handleRecenter}
          className="p-3 bg-white shadow-xl rounded-2xl hover:scale-110 transition-all border border-gray-100 text-gray-700"
          title="Recenter"
        >
          <Navigation size={22} />
        </button>
        <button
          onClick={() => setShowHeatmap(!showHeatmap)}
          className={`p-3 shadow-xl rounded-2xl hover:scale-110 transition-all border ${
            showHeatmap ? 'bg-primary text-white border-primary' : 'bg-white text-gray-700 border-gray-100'
          }`}
          title="Toggle Heatmap"
        >
          <Flame size={22} fill={showHeatmap ? "currentColor" : "none"} />
        </button>
      </div>

      {/* Send Pulse Button - Bottom Center */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-[1000]">
        <button 
          onClick={openPulseModal}
          className="px-6 py-3 bg-white/90 backdrop-blur-md border border-white/20 shadow-2xl rounded-full flex items-center gap-2 group hover:bg-primary hover:text-white transition-all scale-100 hover:scale-105"
        >
          <div className="w-2 h-2 bg-green-500 rounded-full animate-ping group-hover:bg-white"></div>
          <span className="font-bold text-sm">Send a Pulse</span>
          <Send size={16} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      {/* Selected User Info Card (Bottom) */}
      {selectedUser && !showPulseModal && (
        <div className="absolute bottom-24 left-6 right-6 z-[1000] animate-in slide-in-from-bottom-10">
          <div className="bg-white/90 backdrop-blur-xl p-4 rounded-3xl shadow-2xl border border-white/20 flex items-center gap-4">
            <div className="relative">
              <img 
                src={selectedUser.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedUser.username}`}
                className="w-16 h-16 rounded-2xl border-2 border-primary object-cover"
                alt=""
              />
              <div className="absolute -top-2 -right-2 bg-primary text-white text-[10px] font-bold px-2 py-1 rounded-full">
                {selectedUser.distance_km}km
              </div>
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-gray-900">{selectedUser.full_name}</h3>
              <p className="text-xs text-gray-500 line-clamp-1">{selectedUser.bio || "No bio yet"}</p>
              <div className="flex gap-2 mt-2">
                <span className="px-2 py-1 bg-primary/10 text-primary text-[10px] font-bold rounded-lg">
                  {selectedUser.mood_status || "Chilling"}
                </span>
              </div>
            </div>
            <button 
              onClick={() => setSelectedUser(null)}
              className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
            >
              <Users size={20} className="text-gray-400" />
            </button>
          </div>
        </div>
      )}

      {/* Profile Modal */}
      {selectedUser && (
        <ProfileModal user={selectedUser} onClose={() => setSelectedUser(null)} />
      )}

      {/* Pulse Modal */}
      <PulseModal isOpen={showPulseModal} onClose={() => setShowPulseModal(false)} />
    </div>
  );
};

export default Home;