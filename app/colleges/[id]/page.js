"use client";

import { useState, use, useEffect } from "react";
import dynamic from "next/dynamic";
import styles from "./college.module.css";


const DynamicMap = dynamic(() => import("./Map"), {
    ssr: false,
    loading: () => <p>Loading Map...</p>
});


export default function CollegesPage({ params }) {
    const resolvedParams = use(params);
    const collegeId = resolvedParams?.id;

    const [college, setCollege] = useState(null);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [showMap, setShowMap] = useState(false);
    const [coordinates, setCoordinates] = useState([19.133, 72.915]);
    const [clgName, setClgName] = useState("College");


    // TODO: handle errors properly, NetworkError

    const handleClick = async () => {
        console.log(search);
        setShowMap(false);

        if (!search.trim()) return;

        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(resolvedParams.name)}&limit=1`
            )
            const data = await response.json();

            if (data && data.length > 0) {
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

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await fetch('/data/colleges.json');
                const data = await response.json();
                const match = data.find(item => item.id === collegeId);
                setCollege(match);
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        }
        if (collegeId) {
            fetchData();
        }
    }, [collegeId]);

    if (loading) return <p className={styles.statusMsg}>Loading record details...</p>;

    if (!college) {
        return (
            <main className={styles.collegeContainer}>
                <h1 className={styles.collegeTitle}>College profile not found</h1>
            </main>
        );
    }

    return (
        <>
            <a href="/colleges" style={{ width: '385  px', border: 'none', margin: '10px', backgroundColor: '#003b87' }} className={styles.collegeBtn}>See all Colleges</a>
            <main className={styles.collegeContainer}>
                <header className={styles.collegeHeader}>
                    <h1 className={styles.collegeTitle}>{college.name}</h1>
                </header>

                <p className={styles.collegeDesc}>{college.description}</p>

                <div className={styles.collegeGrid}>
                    <div className={styles.metaCard}>
                        <span>Institution Type</span>
                        <strong>{college.type} ({college.shortName})</strong>
                    </div>
                    <div className={styles.metaCard}>
                        <span>State</span>
                        <strong>{college.state}</strong>
                    </div>
                    <div className={styles.metaCard}>
                        <span>City / Location</span>
                        <strong>{college.city}</strong>
                    </div>
                </div>

                <section className={styles.coursesSection}>
                    <h2 className={styles.coursesTitle}>Academic Offerings</h2>
                    <ul className={styles.coursesList}>
                        {college.courses?.map((course, index) => (
                            <li key={index} className={styles.courseItem}>{course}</li>
                        ))}
                    </ul>
                </section>

                <a
                    className={styles.collegeBtn}
                    target="_blank"
                    rel="noopener noreferrer"
                    href={college.website}
                >
                    Visit Official Website
                </a>

                {college?.coordinates && (
                    <DynamicMap
                        center={college.coordinates}
                        zoom={15}
                        name={college.name}
                    />
                )}
            </main>
            <div className={styles.card}>
                <DynamicMap center={coordinates} zoom={17} name={clgName} />
            </div>

        </>
    );
}