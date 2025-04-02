"use client";
import React from "react";
import styles from "./styles.module.scss";
import Image from "next/image";

export default function PromoSection({ img, text }) {
  const handleOpenWhatsApp = () => {
    window.open(
      "https://api.whatsapp.com/send?phone=573174049573&text=Hola%20tengo%20unas%20preguntas%20mongir.com%20quisiera%20atención%20porfavor",
      "_blank"
    );
  };
  return (
    <div className={styles.promo} onClick={handleOpenWhatsApp}>
      <Image
        src={img}
        alt="Mongir Logo"
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
