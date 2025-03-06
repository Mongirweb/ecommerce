import styles from "./styles.module.scss";

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
        <span>COP$ {formatPrice(subtotal)}</span>
      </div>
      <div className={styles.cart__checkout_line}>
        <span>Envío</span>
        <span style={{ color: "#1b5e20" }}>Incluido</span>
      </div>
      <div className={styles.cart__checkout_total}>
        <span>Total</span>
        <span>COP ${formatPrice(total)}</span>
      </div>
      <div className={styles.submit}>
        <button onClick={saveCartToDbHandler}>Hacer Pedido</button>
      </div>
    </div>
  );
}
