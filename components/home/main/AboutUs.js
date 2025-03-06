import { StylesProvider } from "@material-ui/core";
import styles from "./main.module.scss";
import React from "react";
import { signOut, signIn } from "next-auth/react";

export default function AboutUs() {
  return (
    <div className={styles.about_us}>
      <p>
        <strong>¿Que es</strong> Empresy?
      </p>
      <div className={styles.about_us__texts}>
        <div className={styles.about_us__texts_text}>
          <span>
            <p>Una comunidad de empresarios locales</p>
            con la misión de impulsar la visibilidad de negocios locales para
            aumentar las ventas y fomentar el apoyo mutuo y el crecimiento
            conjunto.
          </span>
          <button onClick={() => signIn()}>Unirme ahora!</button>
        </div>
        <div className={styles.about_us__texts_text}>
          <span>
            <p>Marketplace de productos y servicios para ti y tu empresa</p>
            Encuentra todo lo que necesitas y descubre una variedad de negocios,
            productos y servicios, y contribuye al crecimiento de tu comunidad
            al comprar a negocios cercanos.
          </span>
          <button onClick={() => signIn()}>Registrarme</button>
        </div>
        <div className={styles.about_us__texts_text}>
          <span>
            <p>¡Crea tu e-commerce en un par de clics!</p>
            Nuestra plataforma intuitiva y fácil de usar te permite listar tus
            productos y servicios rápidamente. Además, te conectas directamente
            con tus clientes a través de WhatsApp.
          </span>
          <button onClick={() => signIn()}>Crear mi e-commerce!</button>
        </div>
      </div>
    </div>
  );
}
