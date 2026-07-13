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

  const mapCenter = college.center
    ? [parseFloat(college.center.lat), parseFloat(college.center.lng)] 
    : null;

  return (
    <>
      <a href="/colleges" style={{ border: 'none', margin: '10px', backgroundColor: '#003b87' }} className={styles.collegeBtn}>See all Colleges</a>
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

      </main>

      {college?.center && (
        <div className={styles.mapCard}>
          <DynamicMap id={collegeId} center={mapCenter} zoom={17} name={college.name} />
        </div>
      )}

    </>
  );
}