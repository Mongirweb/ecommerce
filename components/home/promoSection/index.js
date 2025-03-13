import React from "react";
import styles from "./styles.module.scss";
import Image from "next/image";

export default function PromoSection({ img, text }) {
  return (
    <div className={styles.promo}>
      <Image
        src={img}
        alt="promo-somoselhueco"
        loading="lazy"
        width={300}
        height={300}
      />
      <div className={styles.text}>
        <p>{text}</p>
      </div>
    </div>
  );
}
