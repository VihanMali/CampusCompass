"use client";

import { useEffect, useState } from "react";
import "leaflet/dist/leaflet.css";
import { MapContainer, Marker, Polygon, Popup, TileLayer, useMap } from "react-leaflet";
import L from "leaflet";

// Fix default marker asset missing issues in Next.js SSR/Builds
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});


// Viewport controller to dynamically adjust center and map visibility properties
function MapViewportController({ center, boundary }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView(center, 15);
    }
  }, [center, map]);
  return null;
}

export default function Map({ id, center, zoom, name }) {
  const [boundary, setBoundary] = useState([]);
  const [campusPlaces, setCampusPlaces] = useState([]);
  const [worldMask, setWorldMask] = useState([]);

  // Generate an inverted background shield that whites out everything outside the target boundary
  const constructSpatialMask = (polygonCoords) => {
    const worldOuterRing = [
      [90, -180], [90, 180], [-90, 180], [-90, -180], [90, -180]
    ];
    setWorldMask([worldOuterRing, polygonCoords]);
  };

  useEffect(() => {
    async function loadMapData() {
      const res = await fetch(`/api/colleges/${id}/map`);
      const data = await res.json();

      if (data) {
        setBoundary(data.boundary);
        setCampusPlaces(data.campusPlaces);
  
        constructSpatialMask(data.boundary);
      }
    }

    if (id) {
      loadMapData();
    }
  }, [id]);

  return (
    <MapContainer
      center={center}
      zoom={zoom}
      style={{ height: "600px", width: "100%", backgroundColor: "#f5f5f5" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://openstreetmap.org">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* Spatial Cutout Shield: Obscures everything outside the accurate polygon */}
      {worldMask.length > 0 && (
        <Polygon
          positions={worldMask}
          pathOptions={{ color: "transparent", fillColor: "#ffffff", fillOpacity: 0.60, pane: "tilePane" }}
        />
      )}

      {/* Actual Campus Boundary Poly: Highly customized per university */}
      {boundary.length > 0 && (
        <Polygon
          positions={boundary}
          pathOptions={{ color: "#003b87", weight: 3, fillColor: "transparent" }}
        />
      )}

      {/* Primary Pinpointer Marker */}
      <Marker position={center}>
        <Popup>{name || "College"}</Popup>
      </Marker>

      {/* Inner Campus Place Names: Only renders if coordinates fall within the container map array */}
      {campusPlaces.map((place) => (
        <Marker
          key={place.id} 
          position={[place.latitude, place.longitude]} 
          icon={new L.DivIcon({
            className: 'custom-poi-label',
            html: `<div style="background: rgba(255,255,255,0.9); padding: 4px 8px; border: 1px solid #003b87; border-radius: 4px; font-weight: bold; font-size: 11px; white-space: nowrap; color: #003b87; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
              ${place.name}
            </div>`,
            iconSize: [100, 40],
            iconAnchor: [50, 20]
          })}
        />
      ))}

      <MapViewportController center={center} boundary={boundary} />
    </MapContainer>
  );
}
