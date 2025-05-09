import Image from "next/image";
import styles from "./footer.module.scss";

export default function Payment() {
  return (
    <div className={styles.footer__payment}>
      <h3>Aceptamos</h3>
      <div className={styles.footer__flexwrap}>
        <Image
          width={300}
          height={300}
          src="/images/payment/PCI.svg"
          alt="wompi"
          loading="lazy"
        />
        <Image
          width={300}
          height={200}
          src="/images/payment/visa-brandmark-blue-1960x622.webp"
          alt="Visa"
          loading="lazy"
        />
        <Image
          width={300}
          height={200}
          src="/images/payment/ma-bc_mastercard-logo_eq.png"
          alt="MasterCard"
          loading="lazy"
        />

        <Image
          width={300}
          height={200}
          src="/images/payment/pse-seeklogo.svg"
          alt="PayPal"
          loading="lazy"
        />
      </div>
    </div>
  );
}
