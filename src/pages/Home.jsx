import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Navigation, Loader2 } from 'lucide-react';

// Fix default marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Auto move map
const ChangeView = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.flyTo(center, 15);
    }
  }, [center]);
  return null;
};

const Home = () => {
  const [center, setCenter] = useState([28.6139, 77.2090]);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [userLocation, setUserLocation] = useState(null);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        const newCenter = [latitude, longitude];

        setCenter(newCenter);
        setUserLocation(newCenter);

        // Dummy nearby users
        setUsers([
          { id: 1, name: 'Rahul', pos: [latitude + 0.002, longitude + 0.002], distance: '200m' },
          { id: 2, name: 'Anjali', pos: [latitude - 0.002, longitude - 0.002], distance: '500m' },
        ]);

        setLoading(false);
      },
      () => setLoading(false)
    );
  }, []);

  return (
    <div className="relative h-[calc(100vh-4rem)] w-full bg-white">

      {/* Loader */}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white z-50">
          <Loader2 className="animate-spin text-primary" size={40} />
        </div>
      )}

      {/* Map */}
      <MapContainer center={center} zoom={15} className="h-full w-full">
        <ChangeView center={center} />

        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Current User */}
        {userLocation && (
          <Marker position={userLocation}>
            <Popup>You are here</Popup>
          </Marker>
        )}

        {/* Nearby Users */}
        {users.map((user) => (
          <React.Fragment key={user.id}>
            <Circle
              center={user.pos}
              radius={150}
              pathOptions={{
                color: '#00f2fe',
                fillOpacity: 0.1,
              }}
            />
            <Marker position={user.pos}>
              <Popup>
                <b>{user.name}</b><br />
                {user.distance} away
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