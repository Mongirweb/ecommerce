import Link from "next/link";
import styles from "./header.module.scss";
import { TbTruckDelivery } from "react-icons/tb";
import { IoCardOutline } from "react-icons/io5";
import { LuShieldCheck } from "react-icons/lu";

export default function Ad() {
  return (
    <Link href="/" prefetch={true}>
      <div className={styles.ad}>
        <div className={styles.ad__text_1}>
          <TbTruckDelivery /> <p>Envío gratis y rápido</p>
        </div>
        <div className={styles.ad__text_2}>
          <LuShieldCheck /> Compra Segura
        </div>
        <div className={styles.ad__text_3}>
          <IoCardOutline /> Paga como te gusta, efectivo o tarjeta
        </div>
      </div>
    </Link>
  );
}
