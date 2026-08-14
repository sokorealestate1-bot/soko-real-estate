import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';

// Fix Leaflet marker icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const LocationPicker = ({ onLocationChange, initialPosition }) => {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const [position, setPosition] = useState(
    initialPosition || { lat: -13.2543, lng: 34.3015 }
  );

  useEffect(() => {
    if (!mapContainerRef.current) return;

    const map = L.map(mapContainerRef.current).setView([position.lat, position.lng], 10);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
    }).addTo(map);

    const marker = L.marker([position.lat, position.lng], { draggable: true })
      .addTo(map)
      .bindPopup('Drag me to pin the location')
      .openPopup();

    marker.on('dragend', () => {
      const pos = marker.getLatLng();
      const newPosition = { lat: pos.lat, lng: pos.lng };
      setPosition(newPosition);
      if (onLocationChange) {
        onLocationChange(newPosition);
      }
    });

    map.on('click', (e) => {
      const newPosition = { lat: e.latlng.lat, lng: e.latlng.lng };
      marker.setLatLng(newPosition);
      setPosition(newPosition);
      if (onLocationChange) {
        onLocationChange(newPosition);
      }
    });

    mapRef.current = map;
    markerRef.current = marker;

    return () => {
      map.remove();
    };
  }, []);

  return (
    <div>
      <div 
        ref={mapContainerRef}
        style={{ height: "300px", width: "100%", borderRadius: "12px", overflow: "hidden" }}
      />
      <p style={{ fontSize: "12px", color: "#94a3b8", marginTop: "4px" }}>
        🖱️ Drag the marker or click on the map to pin the exact location.
      </p>
    </div>
  );
};

export default LocationPicker;