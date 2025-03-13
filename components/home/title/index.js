import React from "react";
import styles from "./styles.module.scss";

export default function Title({ title }) {
  return (
    <div className={styles.title}>
      <span className={styles.line} />
      <span className={styles.text}>{title || "En construccion"}</span>
      <span className={styles.line} />
    </div>
  );
}
