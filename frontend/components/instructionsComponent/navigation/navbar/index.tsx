"use client";

import { ConnectKitButton } from "connectkit";
import Link from "next/link";

import styles from "./Navbar.module.css";
export default function Navbar() {
  return (
    <nav className={styles.navbar}>
      <Link href="/">
        <p>home</p>
      </Link>
      <ConnectKitButton />
    </nav>
  );
}
