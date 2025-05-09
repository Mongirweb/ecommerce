"use client";
import React, { useEffect, useState } from "react";
import styles from "./styles.module.scss";
import Image from "next/image";
import whatsappIcon from "../../public/images/WhatsApp.svg";

export default function Whatsapp() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const doc = document.documentElement;

    const handleScroll = () => {
      const { scrollHeight, clientHeight, scrollTop } = doc;
      const isScrollable = scrollHeight > clientHeight;
      const isBottom = scrollTop + clientHeight >= scrollHeight;

      if (!isScrollable) {
        // never scrollable → always visible
        setVisible(true);
      } else if (scrollTop > 100 && !isBottom) {
        // scrolled past threshold, but not at bottom
        setVisible(true);
      } else {
        setVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    // initialize on mount
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <a
      href="https://api.whatsapp.com/send?phone=573156907083&text=Hola%20tengo%20unas%20preguntas%20mongir.com%20quisiera%20atención%20porfavor"
      target="_blank"
      rel="noopener noreferrer"
      className={`${styles.whatsapp} ${visible ? styles.visible : ""}`}
    >
      <span className={styles.whatsapp__icon}>
        <span className={styles.whatsapp__icon__span}></span>
      </span>
      <Image
        src={whatsappIcon}
        width={40}
        height={40}
        alt="somoselhueco"
        loading="lazy"
        className={styles.whatsapp__icon__image}
      />
    </a>
  );
}
