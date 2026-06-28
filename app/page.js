"use client";

import styles from "./page.module.css";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  const handleOpenFile = () => {
    router.push("/colleges");
  };

  return (
    <>
      {/* Background Matrix/Rain Animation */}
      <div className={styles.lines}>
        <div className={styles.line}></div>
        <div className={styles.line}></div>
        <div className={styles.line}></div>
        <div className={styles.line}></div>
        <div className={styles.line}></div>
        <div className={styles.line}></div>
        <div className={styles.line}></div>
        <div className={styles.line}></div>
        <div className={styles.line}></div>
        <div className={styles.line}></div>
      </div>

      {/* Main Content */}
      <div className={styles.contentWrapper}>
        <h2 className={styles.subTitle}>Welcome to</h2>
        <h1 className={styles.title}>CampusCompass</h1>
        <button onClick={handleOpenFile} className={styles.getStartedBtn}>
          Get Started
        </button>
      </div>
    </>
  );
}
