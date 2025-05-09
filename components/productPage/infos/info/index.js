import React from "react";
import styles from "./styles.module.scss";
import { Truck } from "lucide-react";
import { ShieldCheck } from "lucide-react";
import { ReceiptText } from "lucide-react";

export default function Info() {
  return (
    <div className={styles.info}>
      <div className={styles.info__option}>
        <div className={styles.info__option_first}>
          <Truck />
          <p>Envío rápido</p>
        </div>
        <span>Nos movemos con las mejores empresas de envío.</span>
      </div>
      <div className={styles.info__option}>
        <div className={styles.info__option_first}>
          <ShieldCheck />
          <p>Pago seguro con Wompi</p>
        </div>
        <span>
          Utilizamos la pasarela de pagos Wompi, filial de Bancolombia.
        </span>
      </div>
      <div className={styles.info__option}>
        <div className={styles.info__option_first}>
          <ReceiptText />
          <p>Garantía</p>
        </div>
        <span>Garantía sobre tu pedido.</span>
      </div>
    </div>
  );
}
