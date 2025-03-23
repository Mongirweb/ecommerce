"use client";
import Ad from "./Ad";
import Main from "./Main";
import styles from "./header.module.scss";
import Top from "./Top";

export default function Header({ searchHandler, searchParams }) {
  return (
    <header className={styles.header}>
      <Ad />
      <Top />
      <Main searchHandler={searchHandler} searchParams={searchParams} />
    </header>
  );
}
