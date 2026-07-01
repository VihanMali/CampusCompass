<<<<<<< HEAD
'use client';
import { useEffect, useState } from 'react';
import { XMLParser } from 'fast-xml-parser';

// 1. Define the strict boundaries (South-West corner, North-East corner)
const BOUNDS = [
  [18.90, 72.75], // Bottom-Left limit
  [19.25, 73.05]  // Top-Right limit
];

// Raw XML string data from OpenStreetMap
const rawXmlData = `<?xml version="1.0" encoding="UTF-8"?>
<osm version="0.6" generator="Overpass API 0.7.62.11 87bfad18">
  <note>The data included in this document is from www.openstreetmap.org. The data is made available under ODbL.</note>
  <meta osm_base="2026-06-29T10:34:30Z"/>
  <node id="2568650320" lat="19.0424756" lon="72.9272891">
    <tag k="amenity" v="drinking_water"/>
  </node>
  <node id="2568659863" lat="19.0420204" lon="72.9283171">
    <tag k="amenity" v="drinking_water"/>
  </node>
  <node id="12293013067" lat="19.0627636" lon="72.9008494">
    <tag k="amenity" v="drinking_water"/>
    <tag k="drinking_water" v="yes"/>
    <tag k="man_made" v="water_tap"/>
    <tag k="name" v="Durgadevi Saraf Pyau"/>
  </node>
</osm>`;

export default function Colleges() {
  const [markers, setMarkers] = useState([]);
  const [MapComponents, setMapComponents] = useState(null);

  useEffect(() => {
    // Prevent execution during Next.js server-side pre-rendering
    if (typeof window === 'undefined') return;

    // Dynamically require Leaflet packages strictly on the client browser
    const Leaflet = require('leaflet');
    const ReactLeaflet = require('react-leaflet');
    
    // Inject the default Leaflet CSS maps styling safely
    require('leaflet/dist/leaflet.css');

    // Reconfigure the default asset markers paths safely via open CDN strings
    delete Leaflet.Icon.Default.prototype._getIconUrl;
    Leaflet.Icon.Default.mergeOptions({
      iconUrl: 'https://unpkg.com',
      iconRetinaUrl: 'https://unpkg.com',
      shadowUrl: 'https://unpkg.com',
    });

    // Save verified UI modules into local React state
    setMapComponents({
      MapContainer: ReactLeaflet.MapContainer,
      TileLayer: ReactLeaflet.TileLayer,
      Marker: ReactLeaflet.Marker,
      Popup: ReactLeaflet.Popup,
    });

    // Parse the XML structures safely
    const parser = new XMLParser({
      ignoreAttributes: false,
      attributeNamePrefix: '',
    });
    
    const jsonObj = parser.parse(rawXmlData);
    const nodes = jsonObj.osm.node;
    const parsedNodes = Array.isArray(nodes) ? nodes : [nodes];

    const mappedMarkers = parsedNodes.map((node) => {
      const tags = Array.isArray(node.tag) ? node.tag : node.tag ? [node.tag] : [];
      const tagMap = tags.reduce((acc, currentTag) => {
        acc[currentTag.k] = currentTag.v;
        return acc;
      }, {});

      return {
        id: node.id,
        position: [parseFloat(node.lat), parseFloat(node.lon)],
        name: tagMap.name || `Water Station (${node.id})`,
        amenity: tagMap.amenity || 'Unknown',
      };
    });

    setMarkers(mappedMarkers);
  }, []);

  // Structural fallback placeholder rendered safely on the server side
  if (!MapComponents || markers.length === 0) {
    return (
      <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
        <p>Loading Secured Map Workspace...</p>
      </div>
    );
  }

  // Extract client-ready components out of state
  const { MapContainer, TileLayer, Marker, Popup } = MapComponents;
  const defaultCenter = markers[0].position;

  return (
    <div style={{ height: '500px', width: '100%', borderRadius: '8px', overflow: 'hidden' }}>
      <MapContainer 
        center={defaultCenter} 
        zoom={13} 
        minZoom={11}               // Restricts zooming out too far to hide background grey spots
        maxZoom={18}               // Restricts extreme detail zooming
        maxBounds={BOUNDS}         // Hard locks panning bounds to the defined box rectangle
        maxBoundsViscosity={1.0}   // 1.0 means solid boundary walls; users cannot drag past the edge
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://openstreetmap.org">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {markers.map((marker) => (
          <Marker key={marker.id} position={marker.position}>
            <Popup>
              <div style={{ fontFamily: 'sans-serif', fontSize: '14px' }}>
                <strong>{marker.name}</strong>
                <br />
                <span style={{ color: '#666' }}>Type: {marker.amenity}</span>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import styles from "../page.module.css";


// Dynamically import the map component with SSR disabled
const DynamicMap = dynamic(() => import("./Map"), {
  ssr: false,
  loading: () => <p>Loading Map...</p>
});


export default function CollegesPage() {
  const [search, setSearch] = useState("");
  const [showMap, setShowMap] = useState(false);
  const [coordinates, setCoordinates] = useState([19.133, 72.915]);
  const [clgName, setClgName] = useState("College");


  // TODO: handle errors properly, NetworkError

  const handleClick = async () => {
    console.log(search);
    setShowMap(false);
    
    if(!search.trim()) return;

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(search)}&limit=1`
      )
      const data = await response.json();

      if(data && data.length > 0) {
        console.log(data[0]);
        // console.log(typeof(data[0].lat));
        // console.log(data[0].lon);

        const lat = parseFloat(data[0].lat);
        const lon = parseFloat(data[0].lon);

        setCoordinates([lat, lon])
        setClgName(data[0].name)
        setShowMap(true);
      } else {
        // TODO: show it in the frontend
        console.log("Could not get that college!");
      }

    } catch (error) {
        // TODO: show it in the frontend
      console.error("Geocoding error: ", error);
    }
  };

  return (
    <>
      <div>
        <input
          type="text"
          placeholder="Search colleges..."
          className={styles.search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <button onClick={handleClick} className={styles.searchBtn} >Search</button>

        {showMap && (
          <div className={styles.card}>
            <DynamicMap center={coordinates} zoom={17} name={clgName} />
          </div>
        )}

      </div>
    </>
  );
}
>>>>>>> expt
