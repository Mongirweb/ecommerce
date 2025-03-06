import Image from "next/image";
import { paymentMethods } from "../../../data/paymentMethods";
import styles from "./styles.module.scss";
import { useEffect } from "react";

export default function Payment({ paymentMethod, setPaymentMethod, profile }) {
  // Set default payment method on component mount
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

  // Handle change event for radio inputs
  const handlePaymentChange = (event) => {
    setPaymentMethod(event.target.id);
  };

  return (
    <div className={styles.payment}>
      {!profile && (
        <div className={styles.header}>
          <h3>Selecciona método de Pago</h3>
        </div>
      )}
      {paymentMethods?.map((pm) => (
        <label
          htmlFor={pm.id}
          key={pm.id}
          className={`${styles.payment__item} ${
            paymentMethod === pm.id ? styles.selected : ""
          }`}
          style={{
            background: `${paymentMethod === pm.id ? "#f5f5f5" : ""}`,
          }}
        >
          <input
            type="radio"
            name="payment"
            id={pm.id}
            checked={paymentMethod === pm.id}
            onChange={handlePaymentChange}
          />
          <Image
            width={50} // Adjusted size for better responsiveness
            height={50}
            src={`/images/checkout/${pm.id}.webp`}
            alt={pm.name}
            className={styles.paymentImage}
            loading="lazy"
          />
          <div className={styles.payment__item_col}>
            <span>Paga con {pm.name}</span>
            <p>
              {pm?.images?.length > 0
                ? pm.images.map((img, i) => (
                    <Image
                      width={30} // Adjusted size for better responsiveness
                      height={30}
                      key={i}
                      src={`/images/payment/${img}.webp`}
                      alt={`${pm.name} logo ${i + 1}`}
                      className={styles.paymentLogo}
                      loading="lazy"
                    />
                  ))
                : pm.description}
            </p>
          </div>
        </label>
      ))}
    </div>
  );
}
