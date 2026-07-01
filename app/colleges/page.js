"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import styles from "./colleges.module.css";
import Link from "next/link";


const DynamicMap = dynamic(() => import("./Map"), {
  ssr: false,
  loading: () => <p>Loading Map...</p>
});

export default function CollegesPage() {
  const [colleges, setColleges] = useState([]);

  async function getData() {
    const res = await fetch('api/server/');
    const data = await res.json();
    setColleges(data);
  }

  useEffect(() => {
    getData();
  }, []);

  return (
    <div className={styles.pageContainer}>
      <ul className={styles.gridContainer}>
        {colleges.map(college => (
          <Link href={`/colleges/${college.id}`}
          className={styles.card} key={college.id}>
          <h2>🎓{college.shortName}</h2>
          <h3 style={{color:'#7e7e7e'}}>{college.name}</h3> 
          </Link>
        ))}
      </ul>
    </div>
  );
}
