import React, { useEffect, useRef } from 'react';
import L from 'leaflet';

// Fix Leaflet marker icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const PropertyMap = ({ latitude, longitude, locationName }) => {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);

  useEffect(() => {
    if (!latitude || !longitude || !mapContainerRef.current) return;

    // Create map
    const map = L.map(mapContainerRef.current).setView([latitude, longitude], 15);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
    }).addTo(map);

    L.marker([latitude, longitude])
      .addTo(map)
      .bindPopup(locationName || 'Property Location')
      .openPopup();

    mapRef.current = map;

    return () => {
      map.remove();
    };
  }, [latitude, longitude, locationName]);

  if (!latitude || !longitude) {
    return (
      <div style={{
        background: "#f1f5f9",
        padding: "40px",
        textAlign: "center",
        borderRadius: "12px",
        color: "#64748b"
      }}>
        📍 No location available for this property.
      </div>
    );
  }

  return (
    <div 
      ref={mapContainerRef}
      style={{ height: "300px", width: "100%", borderRadius: "12px", overflow: "hidden" }}
    />
  );
};

export default PropertyMap;