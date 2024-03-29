"use client";

import { ConnectKitButton } from "connectkit";

import styles from "./navbar.module.css";
export function Navbar() {
  return (
    <nav className={styles.navbar}>
      <ConnectKitButton />
    </nav>
  );
}
