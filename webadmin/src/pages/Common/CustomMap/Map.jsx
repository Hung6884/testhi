import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Polyline } from 'react-leaflet';
import axios from 'axios';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
// FIX: Manually set default icon to prevent broken image issue
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';
import { isEmpty } from 'lodash';
import MapAutoCenter from './MapAutoCenter';
import { startIcon, endIcon } from '../../../utils/customIcons.js';

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl,
  iconUrl,
  shadowUrl,
});
const API_HOST = window.env.API_HOST;
const RouteMap = ({ locations }) => {
  const [route, setRoute] = useState([]);

  useEffect(() => {
    setRoute([]);
    if (locations.length < 2) return;

    const coordArray = locations.map((p) => [p.lat, p.lng]);

    axios
      .post(`${API_HOST}/route-map`, { coordinates: coordArray })
      .then((res) => {
        const coords = res.data.coordinates.map(
          ([lng, lat]) => [lat, lng],
        );
        setRoute(coords);
      })
      .catch((err) => console.error('Error fetching route map:', err));
  }, [locations]);

  const center = !isEmpty(locations)
    ? locations[0]
    : { lat: 18.6796, lng: 105.6813 }; //Thành phố Vinh

  return (
    <MapContainer
      center={center}
      zoom={13}
      style={{ height: '100%', width: '100%' }}
    >
      <MapAutoCenter center={center} />
      <TileLayer
        attribution="&copy; OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {locations.length > 0 && (
        <Marker
          position={[locations[0].lat, locations[0].lng]}
          icon={startIcon}
        />
      )}
      {locations.length > 1 && (
        <Marker
          position={[
            locations[locations.length - 1].lat,
            locations[locations.length - 1].lng,
          ]}
          icon={endIcon}
        />
      )}

      {route.length > 0 && <Polyline positions={route} color="blue" />}
    </MapContainer>
  );
};

export default RouteMap;
