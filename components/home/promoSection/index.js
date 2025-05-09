"use client";
import React from "react";
import styles from "./styles.module.scss";
import Image from "next/image";

export default function PromoSection({ text, img }) {
  const handleOpenWhatsApp = () => {
    window.open(
      "https://api.whatsapp.com/send?phone=573147193718&text=Hola%20tengo%20unas%20preguntas%20somoselhueco.com%20quisiera%20atención%20porfavor",
      "_blank"
    );
  };
  return (
    <div className={styles.promo} onClick={handleOpenWhatsApp}>
      <Image
        src={img}
        width={1000}
        height={1000}
        alt="promo-somoselhueco-"
        loading="lazy"
      />
      <div className={styles.text}>
        <p>{text}</p>
      </div>
    </div>
  );
}
