'use client'
import { useEffect, useState, use } from "react";
import styles from "./college.module.css";

export default function College({ params }) {
    const resolvedParams = use(params);
    const [college, setCollege] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await fetch('/data/colleges.json');
                const data = await response.json();
                const match = data.find(item => item.id === resolvedParams?.id);
                setCollege(match);
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        }
        if (resolvedParams?.id) {
            fetchData();
        }
    }, [resolvedParams?.id]);

    if (loading) return <p className={styles.statusMsg}>Loading record details...</p>;

    if (!college) {
        return (
            <main className={styles.collegeContainer}>
                <h1 className={styles.collegeTitle}>College profile not found</h1>
            </main>
        );
    }

    return (
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
    );
}
