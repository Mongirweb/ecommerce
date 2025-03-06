"use client";
import React from "react";
import Footer from "../../components/footer";
import Header from "../../components/header";
import styles from "./styles.module.scss";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";

const handleOpenWhatsApp = () => {
  window.open(
    "https://api.whatsapp.com/send?phone=15551515711&text=Hola%20tengo%20unas%20preguntas%20somoselhueco.com%20quisiera%20atención%20porfavor",
    "_blank"
  );
};

export default function ClientWhatsapp() {
  return (
    <>
      <Header />
      <div className={styles.client}>
        <div className={styles.client__info}>
          <h2>Servicio al Cliente</h2>
          <span>
            Con el proposito de brindarte una experiencia y atención
            personalizada te invitamos a escribirnos a nuestra linea de WhatsApp
            para contactarnos y resolver tus dudas.
          </span>
          <button
            className={styles.client__button}
            onClick={handleOpenWhatsApp}
          >
            WhatsApp <WhatsAppIcon />
          </button>
        </div>
      </div>
      <Footer />
    </>
  );
}
