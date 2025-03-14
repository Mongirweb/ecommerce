"use client";
import Ad from "./Ad";
import Main from "./Main";
import styles from "./header.module.scss";

export default function Header({ searchHandler, searchParams }) {
  return (
    <header className={styles.header}>
      <Ad />
      <Main searchHandler={searchHandler} searchParams={searchParams} />
    </header>
  );
}
