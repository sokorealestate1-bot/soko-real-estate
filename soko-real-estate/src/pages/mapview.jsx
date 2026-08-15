import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import L from 'leaflet';
import logo from '../assets/logo.png';

// Fix Leaflet marker icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const MapView = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const markersRef = useRef([]);

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      const res = await axios.get('https://soko-backend-hwvp.onrender.com/api/properties');
      const approved = res.data.filter(p => p.status === 'Approved');
      setProperties(approved);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching properties:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!loading && properties.length > 0 && mapContainerRef.current) {
      if (!mapRef.current) {
        const map = L.map(mapContainerRef.current).setView([-13.2543, 34.3015], 7);
        
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors',
        }).addTo(map);

        mapRef.current = map;
      }

      markersRef.current.forEach(marker => marker.remove());
      markersRef.current = [];

      properties.forEach(property => {
        if (property.latitude && property.longitude) {
          const marker = L.marker([property.latitude, property.longitude])
            .addTo(mapRef.current)
            .bindPopup(`
              <div style="font-family: Arial, sans-serif; max-width: 200px;">
                <strong>${property.title}</strong><br/>
                <span style="color: #64748b; font-size: 13px;">📍 ${property.location}</span><br/>
                <span style="color: #0f172a; font-weight: 700;">MK ${property.price.toLocaleString()}</span><br/>
                <a href="/property/${property._id}" style="color: #14b8a6; font-weight: 600; text-decoration: none;">View Details →</a>
              </div>
            `);

          markersRef.current.push(marker);
        }
      });

      if (markersRef.current.length > 0) {
        const group = L.featureGroup(markersRef.current);
        mapRef.current.fitBounds(group.getBounds().pad(0.1));
      }

    }
  }, [loading, properties]);

  if (loading) {
    return (
      <div style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#f8fafc"
      }}>
        <div style={{ textAlign: "center" }}>
          <div style={{
            width: "48px",
            height: "48px",
            border: "4px solid #e2e8f0",
            borderTopColor: "#14b8a6",
            borderRadius: "50%",
            animation: "spin 0.8s linear infinite",
            margin: "0 auto"
          }} />
          <p style={{ marginTop: "16px", color: "#64748b" }}>Loading properties map...</p>
        </div>
      </div>
    );
  }

  const propertiesWithLocation = properties.filter(p => p.latitude && p.longitude);
  const propertiesWithoutLocation = properties.filter(p => !p.latitude || !p.longitude);

  return (
    <div style={{
      minHeight: "100vh",
      background: "#f8fafc",
      fontFamily: "'Segoe UI', Arial, sans-serif"
    }}>
      <nav style={{
        background: "#0f172a",
        padding: "0 40px",
        height: "72px",
        display: "flex",
        alignItems: "center",
        borderBottom: "1px solid #1e293b"
      }}>
        <div style={{ maxWidth: "1440px", width: "100%", margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Link to="/" style={{ display: "flex", alignItems: "center", gap: "8px", textDecoration: "none" }}>
            <img src={logo} alt="SOKO" style={{ height: "40px" }} />
          </Link>
          <div style={{ display: "flex", gap: "24px", alignItems: "center" }}>
            <Link to="/" style={{ color: "#94a3b8", textDecoration: "none", fontSize: "14px", fontWeight: "500" }}>
              Home
            </Link>
            <Link to="/properties" style={{ color: "#94a3b8", textDecoration: "none", fontSize: "14px", fontWeight: "500" }}>
              Browse
            </Link>
            <Link to="/map" style={{ color: "#14b8a6", textDecoration: "none", fontSize: "14px", fontWeight: "600" }}>
              Map View
            </Link>
            <Link to="/contact" style={{ color: "#94a3b8", textDecoration: "none", fontSize: "14px", fontWeight: "500" }}>
              Contact
            </Link>
          </div>
        </div>
      </nav>

      <div style={{ maxWidth: "1440px", margin: "0 auto", padding: "32px 20px" }}>
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "16px"
        }}>
          <div>
            <h1 style={{ fontSize: "28px", fontWeight: "700", color: "#0f172a", marginBottom: "4px" }}>
              Property Map
            </h1>
            <p style={{ color: "#64748b", fontSize: "14px" }}>
              {propertiesWithLocation.length} properties shown on map • {propertiesWithoutLocation.length} without location
            </p>
          </div>
          <Link to="/properties" style={{
            padding: "8px 20px",
            background: "#14b8a6",
            color: "#fff",
            borderRadius: "8px",
            textDecoration: "none",
            fontWeight: "600",
            fontSize: "14px"
          }}>
            List View
          </Link>
        </div>

        <div 
          ref={mapContainerRef}
          style={{ height: "600px", width: "100%", borderRadius: "16px", overflow: "hidden", border: "1px solid #e2e8f0" }}
        />
      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        .leaflet-popup-content-wrapper {
          border-radius: 8px !important;
        }
        .leaflet-popup-content {
          font-family: 'Segoe UI', Arial, sans-serif !important;
        }
      `}</style>
    </div>
  );
};

export default MapView;