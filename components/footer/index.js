"use client";
import Copyright from "./Copyright";
import Links from "./Links";
import NewsLetter from "./NewsLetter";
import Payment from "./Payment";
import Socials from "./Socials";
import styles from "./footer.module.scss";
import Image from "next/image";
import image from "../../public/MONGIR-LOGO.png";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <Image src={image} width={300} height={100} alt="Logo" />
      <div className={styles.footer__container}>
        <Links />
        <Socials />
        <Payment />
        {/* <NewsLetter /> */}
        <Copyright />
      </div>
    </footer>
  );
}
