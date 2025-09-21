import L from 'leaflet';
import waypointIconUrl from '../shared/images/waypoint.png';
import startIconUrl from '../shared/images/start-icon.png';
import endIconUrl from '../shared/images/end-icon.png';

export const startIcon = new L.Icon({
  iconUrl: startIconUrl,
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

export const endIcon = new L.Icon({
  iconUrl: endIconUrl,
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

export const waypointIcon = new L.Icon({
  iconUrl: waypointIconUrl,
  iconSize: [28, 28],
  iconAnchor: [14, 28],
  popupAnchor: [0, -28],
});
