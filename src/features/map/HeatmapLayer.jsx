import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet.heat';

const HeatmapLayer = ({ points, active }) => {
  const map = useMap();

  useEffect(() => {
    if (!active || !points || points.length === 0) return;

    // Heat points format: [lat, lng, intensity]
    const heatPoints = points.map(p => [p.lat, p.lng, 0.5]);
    
    const heatLayer = L.heatLayer(heatPoints, {
      radius: 25,
      blur: 15,
      maxZoom: 17,
      gradient: { 0.4: '#ff0080', 0.65: '#7928ca', 1: '#00f2fe' }
    }).addTo(map);

    return () => {
      map.removeLayer(heatLayer);
    };
  }, [map, points, active]);

  return null;
};

export default HeatmapLayer;
