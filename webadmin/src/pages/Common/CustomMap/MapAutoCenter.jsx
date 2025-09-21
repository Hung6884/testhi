import { useEffect } from 'react';
import { useMap } from 'react-leaflet';

const MapAutoCenter = ({ center }) => {
  const map = useMap();

  useEffect(() => {
    if (center) {
      map.flyTo([center.lat, center.lng], 13);
    }
  }, [center, map]);

  return null;
};

export default MapAutoCenter;
