'use client'; 
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css'; 
import L from 'leaflet';
import styles from './mar.module.css';

// Fix for Next.js Leaflet marker icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

export default function MapComponent({ lat, lng, locationName }) {
  const position = lat && lng ? [lat, lng] : [40.1872, 44.5152];
  const popupText = locationName || "Երևան, Հայաստան";

  return (
    <div className={styles.mapSection}>
      <h3 className={styles.title}>
        📍 Տեղակայում (Location)
      </h3>
      <div className={styles.mapWrapper}>
        <MapContainer 
          key={`${position[0]}-${position[1]}`}
          center={position} 
          zoom={13} 
          style={{ height: "450px", width: "100%", zIndex: 0 }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={position}>
            <Popup>
              {popupText}
            </Popup>
          </Marker>
        </MapContainer>
      </div>
    </div>
  );
}