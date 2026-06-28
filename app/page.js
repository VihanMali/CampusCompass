import Image from "next/image";
import styles from "./page.module.css";

export default function Home() {
  return (
    <>
    <div>
      <h2 className={styles.subTitle}>Welcome to</h2>
      <h1 className={styles.title}>CampusCompass</h1>
      <button className={styles.getStartedBtn}>Get Started</button>
    </div>
    </>
  );
}
