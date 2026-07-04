"use client";

import "leaflet/dist/leaflet.css"
import { MapContainer, Marker, Polygon, Popup, TileLayer } from "react-leaflet";


export default function Map({ center, zoom, name }) {
  const boundary = [
    [13.013707165587677, 74.78790403322655],
    [13.014543414254197, 74.79552153722749],
    [13.013006773365525, 74.79969505056845],
    [13.009912597660046, 74.79239942169093]
  ];


  return (
    <MapContainer
      center={center}
      zoom={zoom}
      style={{ height: "500px", width: "70%" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <Marker position={center}>
        <Popup>
          {name}
        </Popup>
      </Marker>

      <Polygon
        positions={boundary}
      />
      
    </MapContainer>
  );
}