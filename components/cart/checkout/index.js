import { useEffect, useRef } from "react";
import styles from "./styles.module.scss";
import { MdLocalShipping } from "react-icons/md";

export default function Checkout({
  subtotal,
  shippingFee,
  total,
  saveCartToDbHandler,
}) {
  const shakeRef = useRef(null);

  const formatPrice = (price) => {
    return new Intl.NumberFormat("de-DE").format(price);
  };

  useEffect(() => {
    // Ensure the element exists before setting the interval
    if (!shakeRef.current) return;

    const interval = setInterval(() => {
      // Remove the class to reset the animation
      shakeRef.current.classList.remove(styles.shake);
      // Trigger a reflow to restart the animation
      void shakeRef.current.offsetWidth;
      // Add the class back to restart the animation
      shakeRef.current.classList.add(styles.shake);
    }, 7000);

    // Clear the interval on component unmount
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`${styles.cart__checkout} ${styles.card}`}>
      <h2>Total Orden</h2>
      <div className={styles.cart__checkout_line}>
        <span>Subtotal</span>
        <span>${formatPrice(subtotal)}</span>
      </div>
      <div className={styles.cart__checkout_line}>
        <span>Envío</span>
        {(shippingFee === 5000 || shippingFee === 10000) && (
          <span
            style={{
              color: "#1b5e20",
              display: "flex",
              gap: "5px",
              alignItems: "center",
            }}
          >
            ${formatPrice(shippingFee)}
            <p
              style={{
                color: "#f6f6f6f",
                textDecoration: "line-through",
                fontSize: "12px",
              }}
            >
              15.000
            </p>
          </span>
        )}
      </div>
      <div className={styles.cart__checkout_total}>
        <span>Total</span>
        <span>${formatPrice(total)}</span>
      </div>

      <div className={styles.submit}>
        <button onClick={saveCartToDbHandler}>Continuar</button>
      </div>
    </div>
  );
}
