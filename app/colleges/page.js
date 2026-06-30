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