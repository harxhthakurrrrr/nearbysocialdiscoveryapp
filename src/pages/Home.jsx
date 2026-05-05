import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Shield, MapPin, Navigation, Loader2 } from 'lucide-react';
import ProfileModal from '../components/ProfileModal';

// Fix Leaflet icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Helper component to update map view
const ChangeView = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    if (center && !isNaN(center[0]) && !isNaN(center[1])) {
      map.flyTo(center, 15, { duration: 2 });
    }
  }, [center]);
  return null;
};

const Home = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [center, setCenter] = useState([28.6139, 77.2090]); // Default Delhi
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [userLocation, setUserLocation] = useState(null);

  useEffect(() => {
    // Get real current location
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const newCenter = [latitude, longitude];
          setCenter(newCenter);
          setUserLocation(newCenter);
          
          // Generate mock nearby users based on real location
          const mockUsers = [
            { id: 1, name: 'Rahul', pos: [latitude + 0.002, longitude + 0.002], img: 'https://i.pravatar.cc/150?u=1', distance: '200m', xp: 450, blur: true },
            { id: 2, name: 'Anjali', pos: [latitude - 0.001, longitude - 0.003], img: 'https://i.pravatar.cc/150?u=2', distance: '500m', xp: 820, blur: true },
            { id: 3, name: 'Siddharth', pos: [latitude + 0.003, longitude - 0.002], img: 'https://i.pravatar.cc/150?u=3', distance: '1.2km', xp: 120, blur: false, exact: true },
          ];
          setUsers(mockUsers);
          setLoading(false);
        },
        (error) => {
          console.error("Error getting location:", error);
          setLoading(false);
          // Fallback users if location fails
          setUsers([
            { id: 1, name: 'Rahul', pos: [28.6145, 77.2100], img: 'https://i.pravatar.cc/150?u=1', distance: '200m', xp: 450, blur: true },
            { id: 2, name: 'Anjali', pos: [28.6120, 77.2080], img: 'https://i.pravatar.cc/150?u=2', distance: '500m', xp: 820, blur: true },
            { id: 3, name: 'Siddharth', pos: [28.6160, 77.2050], img: 'https://i.pravatar.cc/150?u=3', distance: '1.2km', xp: 120, blur: false, exact: true },
          ]);
        }
      );
    } else {
      setLoading(false);
    }
  }, []);

  const customIcon = (url, isMe = false) => new L.DivIcon({
    className: 'custom-marker',
    html: `
      <div class="relative">
        <div class="w-12 h-12 rounded-full border-2 ${isMe ? 'border-blue-500' : 'border-primary'} overflow-hidden shadow-lg ${isMe ? '' : 'animate-pulse-glow'} bg-bg-dark">
          <img src="${url}" class="w-full h-full object-cover" />
        </div>
        <div class="absolute -bottom-1 -right-1 w-4 h-4 ${isMe ? 'bg-blue-500' : 'bg-green-500'} border-2 border-bg-dark rounded-full"></div>
      </div>
    `,
    iconSize: [48, 48],
    iconAnchor: [24, 48],
  });

  const handleRecenter = () => {
    if (userLocation) setCenter([...userLocation]);
  };

  return (
    <div className="relative h-[calc(100vh-4rem)] w-full overflow-hidden">
      {loading && (
        <div className="absolute inset-0 z-[100] bg-bg-dark/80 backdrop-blur-md flex flex-col items-center justify-center">
          <Loader2 className="text-primary animate-spin mb-4" size={48} />
          <p className="text-gray-400 font-medium">Finding your location...</p>
        </div>
      )}

      {/* Map Section */}
      <MapContainer 
        center={center} 
        zoom={15} 
        className="h-full w-full z-0"
        zoomControl={false}
      >
        <ChangeView center={center} />
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        
        {/* Current User Marker */}
        {userLocation && (
          <Marker position={userLocation} icon={customIcon('https://api.dicebear.com/7.x/avataaars/svg?seed=Harsh', true)}>
            <Popup>
              <div className="p-1 text-center font-bold">You are here</div>
            </Popup>
          </Marker>
        )}

        {users.map(user => (
          <React.Fragment key={user.id}>
            {/* Blurred Location Circle */}
            {user.blur && !user.exact && (
              <Circle
                center={user.pos}
                radius={200}
                pathOptions={{
                  fillColor: '#aa3bff',
                  fillOpacity: 0.1,
                  color: '#aa3bff',
                  weight: 1,
                  dashArray: '5, 10'
                }}
              />
            )}
            
            <Marker 
              position={user.pos} 
              icon={customIcon(user.img)}
              eventHandlers={{
                click: () => setSelectedUser(user),
              }}
            >
              <Popup className="custom-popup">
                <div className="p-2 text-center">
                  <p className="font-bold text-gray-900">{user.name}</p>
                  <p className="text-xs text-gray-500">{user.distance} away</p>
                </div>
              </Popup>
            </Marker>
          </React.Fragment>
        ))}
      </MapContainer>

      {/* Floating Controls */}
      <div className="absolute top-6 right-6 z-10 flex flex-col gap-3">
        <button 
          onClick={handleRecenter}
          className="p-3 glass-card rounded-2xl text-white hover:text-primary transition-colors"
        >
          <Navigation size={24} />
        </button>
        <button className="p-3 glass-card rounded-2xl text-white hover:text-primary transition-colors">
          <Shield size={24} />
        </button>
      </div>

      {/* Stats Overlay */}
      <div className="absolute bottom-6 left-6 z-10 hidden md:block">
        <div className="glass-card p-4 rounded-2xl border border-glass-border flex items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center text-primary">
              <Users size={20} />
            </div>
            <div>
              <p className="text-xs text-gray-400">Nearby Users</p>
              <p className="text-lg font-bold">24 People</p>
            </div>
          </div>
          <div className="h-10 w-[1px] bg-glass-border"></div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-secondary/20 rounded-xl flex items-center justify-center text-secondary">
              <MapPin size={20} />
            </div>
            <div>
              <p className="text-xs text-gray-400">Current Zone</p>
              <p className="text-lg font-bold">New Delhi</p>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Modal */}
      <AnimatePresence>
        {selectedUser && (
          <ProfileModal 
            user={selectedUser} 
            onClose={() => setSelectedUser(null)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Home;
