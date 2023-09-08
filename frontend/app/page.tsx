"use client";
import P2P from "@/components/p2p";
import styles from "./page.module.css";
import "./globals.css";

export default function Home() {
  return (
    <main className={styles.main}>
      <P2P />
    </main>
  );
}
