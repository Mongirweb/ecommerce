import styles from "./styles.module.scss";
import { MdLocalShipping } from "react-icons/md";

export default function Checkout({
  subtotal,
  shippingFee,
  total,
  saveCartToDbHandler,
}) {
  const formatPrice = (price) => {
    return new Intl.NumberFormat("de-DE").format(price);
  };

  return (
    <div className={`${styles.cart__checkout} ${styles.card}`}>
      <h2>Total Orden</h2>
      <div className={styles.cart__checkout_line}>
        <span>Subtotal</span>
        <span>${formatPrice(subtotal)}</span>
      </div>
      <div className={styles.cart__checkout_line}>
        <span>Envío</span>
        {shippingFee === 6000 && (
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
        {shippingFee === 12000 && (
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
      <div className={styles.cart__message_line}>
        <span>
          {" "}
          <MdLocalShipping /> Por compras superiores a $89.900 envío por solo
          $6.000
        </span>
      </div>
      <div className={styles.submit}>
        <button onClick={saveCartToDbHandler}>Hacer Pedido</button>
      </div>
    </div>
  );
}
