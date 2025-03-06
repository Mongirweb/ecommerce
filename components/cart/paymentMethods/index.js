"use client"; // if you're using Next.js 13+ app directory

import { useEffect } from "react";
import Image from "next/image";
import styles from "./styles.module.scss";
import { IoInformationCircle } from "react-icons/io5";
import { FaTicketAlt } from "react-icons/fa";
import { IoIosInformationCircleOutline } from "react-icons/io";
import { IoShieldCheckmark } from "react-icons/io5";
import { paymentMethods } from "../../../data/paymentMethods";
import { IoLockClosedSharp } from "react-icons/io5";

export default function PaymentMethods({ paymentMethod, setPaymentMethod }) {
  useEffect(() => {
    // If no payment method is selected, set to the first available method
    if (!paymentMethod && paymentMethods.length > 0) {
      setPaymentMethod(paymentMethods[0].id);
    }

    // Optionally, if you have a preferred payment method in the profile, set it
    // Uncomment and adjust the following lines if needed
    /*
    if (profile?.preferredPaymentMethod) {
      const preferredMethod = paymentMethods.find(
        (pm) => pm.id === profile.preferredPaymentMethod
      );
      if (preferredMethod) {
        setPaymentMethod(preferredMethod.id);
      }
    }
    */
  }, [paymentMethod, setPaymentMethod]);

  return (
    <div className={`${styles.card} ${styles.cart__method}`}>
      <h2 className={styles.header}>Métodos de pago</h2>

      <div className={styles.images}>
        {paymentMethods?.map((pm) => {
          return (
            <div key={pm.id}>
              {pm?.images?.length > 0 ? (
                pm.images.map((img, i) => (
                  <Image
                    width={30}
                    height={30}
                    key={i}
                    src={`/images/payment/${img}.webp`}
                    alt={`${pm.name} logo ${i + 1}`}
                    className={styles.paymentLogo}
                    loading="lazy"
                  />
                ))
              ) : (
                <span>{pm.description}</span>
              )}
            </div>
          );
        })}
      </div>

      <h2 className={styles.header}>Protección de compra</h2>
      <div className={styles.protection}>
        <IoShieldCheckmark style={{ fontSize: "27px" }} />
        Utilizamos la pasarela de pagos Wompi de Bancolombia.{" "}
      </div>
      <div className={styles.protection}>
        <IoLockClosedSharp />
        No se te cobrará hasta que revises este pedido en la siguiente página.
      </div>

      {/* <div className={styles.protection}>
        <FaTicketAlt fontSize={34} />
        Si tienes un cupón podrás agregarlo cuando selecciones método de pago.
      </div> */}

      <div className={styles.protection}>
        <IoInformationCircle style={{ fontSize: "43px" }} />
        La disponibilidad y el precio de los artículos no están garantizados
        hasta que se finalice el pago.
      </div>
    </div>
  );
}
