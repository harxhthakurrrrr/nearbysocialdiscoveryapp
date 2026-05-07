import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Navigation, Loader2 } from 'lucide-react';
import api from '../api/axios';

// Fix marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const ChangeView = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    if (center) map.flyTo(center, 15);
  }, [center]);
  return null;
};

const Home = () => {
  const [center, setCenter] = useState([28.6139, 77.2090]);
  const [loading, setLoading] = useState(true);
  const [nearbyUsers, setNearbyUsers] = useState([]);
  const [userLocation, setUserLocation] = useState(null);

  // Update location function with Ghost Mode check
  const updateLocation = async (lat, lng) => {
    // 🔥 GHOST MODE CHECK - If enabled, don't share location
    const ghostMode = localStorage.getItem('ghostMode') === 'true';
    if (ghostMode) {
      console.log('👻 Ghost mode ON - location not shared');
      return;
    }
    
    try {
      await api.post('/location/update', {
        lat: lat,
        lng: lng,
        radius_km: 10
      });
      console.log('📍 Location updated successfully');
    } catch (err) {
      console.error('Location update error:', err);
    }
  };

  // Get user location and fetch nearby users
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        const newCenter = [latitude, longitude];
        
        setCenter(newCenter);
        setUserLocation(newCenter);
        
        // Update location on backend (Ghost Mode checked inside function)
        await updateLocation(latitude, longitude);
        
        // Fetch nearby users
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
      }
    );
  }, []);

  return (
    <div className="relative h-[calc(100vh-4rem)] w-full bg-white">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white z-50">
          <Loader2 className="animate-spin text-primary" size={40} />
        </div>
      )}

      <MapContainer center={center} zoom={15} className="h-full w-full">
        <ChangeView center={center} />
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {/* Current User */}
        {userLocation && (
          <Marker position={userLocation}>
            <Popup>You are here</Popup>
          </Marker>
        )}

        {/* Nearby Users from API */}
        {nearbyUsers.map((user) => (
          <React.Fragment key={user._id}>
            <Circle
              center={[user.lat, user.lng]}
              radius={150}
              pathOptions={{ color: '#00f2fe', fillOpacity: 0.1 }}
            />
            <Marker position={[user.lat, user.lng]}>
              <Popup>
                <b>{user.full_name}</b><br />
                {user.distance_km} km away<br />
                {user.bio}
              </Popup>
            </Marker>
          </React.Fragment>
        ))}
      </MapContainer>

      {/* Recenter Button */}
      <div className="absolute top-5 right-5">
        <button
          onClick={() => setCenter(userLocation)}
          className="p-3 bg-white border rounded-xl shadow-sm hover:scale-105 transition"
        >
          <Navigation size={20} />
        </button>
      </div>
    </div>
  );
};

export default Home;
// import React, { useState, useEffect } from 'react';
// import { MapContainer, TileLayer, Marker, Popup, Circle, useMap, Polyline } from 'react-leaflet';
// import 'leaflet/dist/leaflet.css';
// import L from 'leaflet';
// import { Navigation, Loader2, Navigation2 } from 'lucide-react';
// import api from '../api/axios';
// import ProfileModal from '../components/ProfileModal';

// // Fix marker icons
// delete L.Icon.Default.prototype._getIconUrl;
// L.Icon.Default.mergeOptions({
//   iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
//   iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
//   shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
// });

// // Custom avatar marker
// const getAvatarIcon = (avatarUrl, username) => {
//   return L.divIcon({
//     html: `
//       <div class="custom-avatar-marker" style="position: relative;">
//         <img src="${avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`}" 
//              style="width: 44px; height: 44px; border-radius: 50%; border: 3px solid #00f2fe; box-shadow: 0 2px 10px rgba(0,0,0,0.3); background: white; object-fit: cover;" />
//         <div class="pulse-ring" style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 60px; height: 60px; background: rgba(0, 242, 254, 0.4); border-radius: 50%; animation: pulse 1.5s infinite; z-index: -1;"></div>
//       </div>`,
//     className: 'custom-marker',
//     iconSize: [44, 44],
//     popupAnchor: [0, -22]
//   });
// };

// const ChangeView = ({ center }) => {
//   const map = useMap();
//   useEffect(() => {
//     if (center) map.flyTo(center, 15);
//   }, [center]);
//   return null;
// };

// const calculateDistance = (lat1, lon1, lat2, lon2) => {
//   const R = 6371;
//   const dLat = (lat2 - lat1) * Math.PI / 180;
//   const dLon = (lon2 - lon1) * Math.PI / 180;
//   const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
//             Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
//             Math.sin(dLon/2) * Math.sin(dLon/2);
//   const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
//   return (R * c).toFixed(2);
// };

// const Home = () => {
//   const [center, setCenter] = useState([28.6139, 77.2090]);
//   const [loading, setLoading] = useState(true);
//   const [nearbyUsers, setNearbyUsers] = useState([]);
//   const [userLocation, setUserLocation] = useState(null);
//   const [selectedUser, setSelectedUser] = useState(null);
//   const [distanceLine, setDistanceLine] = useState(null);

//   const updateLocation = async (lat, lng) => {
//     const ghostMode = localStorage.getItem('ghostMode') === 'true';
//     if (ghostMode) return;
    
//     try {
//       await api.post('/location/update', { lat, lng, radius_km: 10 });
//     } catch (err) {
//       console.error('Location update error:', err);
//     }
//   };

//   // Watch location continuously
//   useEffect(() => {
//     const watchId = navigator.geolocation.watchPosition(
//       async (pos) => {
//         const { latitude, longitude } = pos.coords;
//         const newCenter = [latitude, longitude];
        
//         setCenter(newCenter);
//         setUserLocation(newCenter);
//         await updateLocation(latitude, longitude);
        
//         // Fetch nearby users
//         try {
//           const res = await api.get('/location/nearby?radius_km=10');
//           setNearbyUsers(res.data.users || []);
//         } catch (err) {
//           console.error('Fetch nearby users error:', err);
//         }
        
//         // Update distance for selected user
//         if (selectedUser) {
//           const newDistance = calculateDistance(latitude, longitude, selectedUser.lat, selectedUser.lng);
//           setSelectedUser(prev => ({ ...prev, distance_km: newDistance }));
//         }
        
//         setLoading(false);
//       },
//       (err) => {
//         console.error('Geolocation error:', err);
//         setLoading(false);
//       },
//       { enableHighAccuracy: true, maximumAge: 5000 }
//     );
    
//     return () => navigator.geolocation.clearWatch(watchId);
//   }, [selectedUser]);

//   // Update distance line when selected user changes
//   useEffect(() => {
//     if (selectedUser && userLocation) {
//       setDistanceLine([
//         [userLocation[0], userLocation[1]],
//         [selectedUser.lat, selectedUser.lng]
//       ]);
//     } else {
//       setDistanceLine(null);
//     }
//   }, [selectedUser, userLocation]);

//   const handleMarkerClick = (user) => {
//     const distance = calculateDistance(userLocation[0], userLocation[1], user.lat, user.lng);
//     setSelectedUser({ ...user, distance_km: distance });
//   };

//   return (
//     <div className="relative h-[calc(100vh-4rem)] w-full">
//       {/* CSS for animations */}
//       <style>{`
//         @keyframes pulse {
//           0% { transform: translate(-50%, -50%) scale(1); opacity: 0.7; }
//           100% { transform: translate(-50%, -50%) scale(2); opacity: 0; }
//         }
//         .pulse-ring {
//           animation: pulse 1.5s infinite;
//         }
//         .custom-marker {
//           background: transparent;
//           border: none;
//         }
//       `}</style>

//       {loading && (
//         <div className="absolute inset-0 flex items-center justify-center bg-bg-dark z-50">
//           <Loader2 className="animate-spin text-primary" size={48} />
//         </div>
//       )}

//       <MapContainer center={center} zoom={15} className="h-full w-full" style={{ background: '#0a0a0c' }}>
//         <ChangeView center={center} />
//         <TileLayer 
//           url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
//           attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
//         />

//         {/* Current User Marker */}
//         {userLocation && (
//           <Marker 
//             position={userLocation}
//             icon={getAvatarIcon(null, 'you')}
//           >
//             <Popup>You are here</Popup>
//           </Marker>
//         )}

//         {/* Distance Line */}
//         {distanceLine && (
//           <Polyline 
//             positions={distanceLine}
//             pathOptions={{ color: '#00f2fe', weight: 3, dashArray: '8, 8', opacity: 0.8 }}
//           />
//         )}

//         {/* Nearby Users */}
//         {nearbyUsers.map((user) => (
//           <Marker
//             key={user._id}
//             position={[user.lat, user.lng]}
//             icon={getAvatarIcon(user.avatar_url, user.username)}
//             eventHandlers={{ click: () => handleMarkerClick(user) }}
//           >
//             <Popup>
//               <div className="text-center p-2">
//                 <img src={user.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`} 
//                      className="w-12 h-12 rounded-full mx-auto mb-2" />
//                 <b>{user.full_name}</b>
//                 <p>{user.distance_km} km away</p>
//               </div>
//             </Popup>
//           </Marker>
//         ))}
//       </MapContainer>

//       {/* Controls */}
//       <div className="absolute bottom-20 right-4 z-10 flex flex-col gap-2">
//         <button
//           onClick={() => setCenter(userLocation)}
//           className="p-3 bg-primary/90 backdrop-blur rounded-full shadow-lg hover:scale-105 transition"
//         >
//           <Navigation className="text-white" size={20} />
//         </button>
//       </div>

//       {/* Distance Info Card (when user selected) */}
//       {selectedUser && (
//         <div className="absolute bottom-28 left-4 right-4 z-10 glass-card p-4 rounded-2xl mx-4">
//           <div className="flex items-center gap-3">
//             <img 
//               src={selectedUser.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedUser.username}`}
//               className="w-14 h-14 rounded-full border-2 border-primary"
//             />
//             <div className="flex-1">
//               <h3 className="font-bold text-white">{selectedUser.full_name}</h3>
//               <p className="text-primary text-sm">{selectedUser.distance_km} km away</p>
//               <p className="text-xs text-gray-400">@{selectedUser.username}</p>
//             </div>
//             <button 
//               onClick={() => setSelectedUser(null)}
//               className="px-4 py-2 glass rounded-xl text-sm"
//             >
//               Close
//             </button>
//           </div>
//         </div>
//       )}

//       {/* Profile Modal */}
//       {selectedUser && (
//         <ProfileModal user={selectedUser} onClose={() => setSelectedUser(null)} />
//       )}
//     </div>
//   );
// };

// export default Home;