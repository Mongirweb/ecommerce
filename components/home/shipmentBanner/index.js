import React from "react";
import styles from "./styles.module.scss";
import { PackageOpen } from "lucide-react";
import { History } from "lucide-react";
import { Receipt } from "lucide-react";
import { Truck } from "lucide-react";
import { BellRing } from "lucide-react";

export default function ShipmentBanner() {
  return (
    <div className={styles.shipmentBanner}>
      <div className={styles.shipmentBanner__top}>
        <div>
          <p>
            <PackageOpen /> ¿Por qué comprar en Mongir?
          </p>
        </div>
        <div className={styles.shipmentBanner__top__text}>
          <p>
            <History /> 59 años en el mercado{" "}
            <span style={{ marginLeft: "8px", marginRight: "10px" }}>|</span>
          </p>
          <p>
            <Receipt /> Garantías para tu pedido{" "}
            <span style={{ marginLeft: "4px", marginRight: "10px" }}>|</span>
          </p>
          <p>
            <Truck /> Envío Rápido
          </p>
        </div>
      </div>
      <div className={styles.shipmentBanner__bottom}>
        <p>
          <BellRing /> ¡Oferta! Envíos a solo $10.000 por compras superiores a
          $89.900
        </p>
      </div>
    </div>
  );
}
