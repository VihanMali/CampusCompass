"use client";

import { useEffect, useState } from "react";
import "leaflet/dist/leaflet.css";
import { MapContainer, Marker, Polygon, Popup, TileLayer, useMap } from "react-leaflet";
import L from "leaflet";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com",
  iconUrl: "https://unpkg.com",
  shadowUrl: "https://unpkg.com",
});

const EXACT_CAMPUS_POLYGONS = {
  "iit-delhi": [
    [28.5485, 77.1842], [28.5512, 77.1915], [28.5471, 77.1995],
    [28.5412, 77.1971], [28.5385, 77.1912], [28.5421, 77.1851]
  ],
  "iit-bombay": [
    [19.1382, 72.9035], [19.1445, 72.9112], [19.1391, 72.9242],
    [19.1285, 72.9215], [19.1242, 72.9152], [19.1311, 72.9051]
  ],
  "iit-madras": [
    [12.9982, 80.2285], [13.0015, 80.2351], [12.9942, 80.2442],
    [12.9841, 80.2391], [12.9862, 80.2295]
  ],
  "iit-kanpur": [
    [26.5215, 80.2212], [26.5242, 80.2355], [26.5112, 80.2461],
    [26.4985, 80.2312], [26.5051, 80.2225]
  ]
};

const INNER_ESTABLISHMENTS = {
  "iit-delhi": [
    { name: "Dogra Hall Auditorium", coords: [28.5458, 77.1918] },
    { name: "IIT Central Library", coords: [28.5449, 77.1928] },
    { name: "Nilgiri Hostel Complex", coords: [28.5423, 77.1895] }
  ],
  "iit-bombay": [
    { name: "Main Building Concourse", coords: [19.1332, 72.9151] },
    { name: "Convocation Hall", coords: [19.1341, 72.9128] },
    { name: "Hostel 14 Skyscraper", coords: [19.1385, 72.9192] }
  ],
  "iit-madras": [
    { name: "Gajendra Circle", coords: [12.9915, 80.2335] },
    { name: "OAT (Open Air Theatre)", coords: [12.9892, 80.2361] }
  ]
};

function MapViewportController({ center, boundary }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView(center, 15);
    }
  }, [center, map]);
  return null;
}

export default function Map({ center, zoom, name }) {
  const [currentCenter, setCurrentCenter] = useState([19.1334, 72.9133]);
  const [currentName, setCurrentName] = useState(name || "College");
  const [activeId, setActiveId] = useState("iit-bombay");
  const [actualBoundary, setActualBoundary] = useState([]);
  const [extendedBoundary, setExtendedBoundary] = useState([]);
  const [worldMask, setWorldMask] = useState([]);

  const computeExtendedBoundary = (coords, distanceMeters) => {
    if (!coords || coords.length === 0) return [];

    let latSum = 0, lngSum = 0;
    coords.forEach(([lat, lng]) => { latSum += lat; lngSum += lng; });
    const cLat = latSum / coords.length;
    const cLng = lngSum / coords.length;

    const latScalar = 111320;
    const lngScalar = 40075000 * Math.cos((cLat * Math.PI) / 180) / 360;

    return coords.map(([lat, lng]) => {
      const vLat = lat - cLat;
      const vLng = lng - cLng;
      const mag = Math.sqrt(vLat * vLat + vLng * vLng) || 1;

      const offsetLat = (vLat / mag) * (distanceMeters / latScalar);
      const offsetLng = (vLng / mag) * (distanceMeters / lngScalar);
      return [lat + offsetLat, lng + offsetLng];
    });
  };

  const constructSpatialMask = (polygonCoords) => {
    const worldOuterRing = [
      [90, -180], [90, 180], [-90, 180], [-90, -180], [90, -180]
    ];
    setWorldMask([worldOuterRing, polygonCoords]);
  };

  const syncCampusGeometry = (id, fallbackLat, fallbackLng) => {
    const truePolygon = EXACT_CAMPUS_POLYGONS[id];

    if (truePolygon) {
      setActualBoundary(truePolygon);
      setExtendedBoundary(computeExtendedBoundary(truePolygon, 50));
      constructSpatialMask(truePolygon);
    } else {
      const lat = fallbackLat;
      const lng = fallbackLng;
      const dLat = 450 / 111320;
      const dLng = 450 / (40075000 * Math.cos((lat * Math.PI) / 180) / 360);

      const computedBase = [
        [lat + dLat, lng - dLng], [lat + dLat * 1.2, lng + dLng * 0.8],
        [lat - dLat * 0.9, lng + dLng * 1.3], [lat - dLat, lng - dLng]
      ];
      setActualBoundary(computedBase);
      setExtendedBoundary(computeExtendedBoundary(computedBase, 50));
      constructSpatialMask(computedBase);
    }
  };

  useEffect(() => {
    if (Array.isArray(center)) {
      setCurrentCenter(center);
    } else if (center && typeof center === "object") {
      const lat = center.lat || center.latitude;
      const lng = center.lng || center.lon || center.longitude;
      if (lat && lng) {
        const pLat = parseFloat(lat);
        const pLng = parseFloat(lng);
        setCurrentCenter([pLat, pLng]);
      }
    }
  }, [center]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const pathSegments = window.location.pathname.split("/");
      const currentId = pathSegments[pathSegments.length - 1];
      setActiveId(currentId);

      fetch("/data/colleges.json")
        .then((res) => res.json())
        .then((data) => {
          const match = data.find((item) => item.id === currentId);
          if (match && match.center) {
            const mLat = parseFloat(match.center.lat);
            const mLng = parseFloat(match.center.lng);
            setCurrentCenter([mLat, mLng]);
            setCurrentName(match.name);
            syncCampusGeometry(currentId, mLat, mLng);
          }
        })
        .catch((err) => console.error("Synchronization loop tracking exception:", err));
    }
  }, [name]);

  return (
    <MapContainer
      center={currentCenter}
      zoom={15}
      style={{ height: "600px", width: "100%", backgroundColor: "#f5f5f5" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://openstreetmap.org">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {worldMask.length > 0 && (
        <Polygon
          positions={worldMask}
          pathOptions={{ color: "transparent", fillColor: "#ffffff", fillOpacity: 0.60, pane: "tilePane" }}
        />
      )}

      {actualBoundary.length > 0 && (
        <Polygon
          positions={actualBoundary}
          pathOptions={{ color: "#003b87", weight: 3, fillColor: "transparent" }}
        />
      )}

      {extendedBoundary.length > 0 && (
        <Polygon
          positions={extendedBoundary}
          pathOptions={{ color: "#b71c1c", weight: 2, dashArray: "4, 10", fillColor: "transparent" }}
        />
      )}

      <Marker position={currentCenter}>
        <Popup>{currentName}</Popup>
      </Marker>

      {INNER_ESTABLISHMENTS[activeId]?.map((place, idx) => (
        <Marker key={idx} position={place.coords} icon={new L.DivIcon({
          className: 'custom-poi-label',
          html: `<div style="background: rgba(255,255,255,0.9); padding: 4px 8px; border: 1px solid #003b87; border-radius: 4px; font-weight: bold; font-size: 11px; white-space: nowrap; color: #003b87; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">${place.name}</div>`,
          iconSize: [100, 40],
          iconAnchor: [50, 20]
        })} />
      ))}

      <MapViewportController center={currentCenter} boundary={actualBoundary} />
    </MapContainer>
  );
}
