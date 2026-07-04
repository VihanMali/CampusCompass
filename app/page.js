"use client";
import { useRouter } from 'next/router';
import {styles} from './page.module.css'

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
        <Button onClick={handleOpenFile} className={styles.getStartedBtn}>
          Get Started
        </Button>
      </div>
    </>
  );
}
