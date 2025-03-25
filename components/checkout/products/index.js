import { FaStaylinked } from "react-icons/fa";
import styles from "./styles.module.scss";
import Image from "next/image";

export default function Products({ cart }) {
  const formatPrice = (price) => {
    return new Intl.NumberFormat("de-DE").format(price);
  };
  return (
    <div className={styles.products}>
      <div className={styles.products__header}>
        <h1>Resumen de tu compra</h1>
        <span>
          {cart?.products?.length == 1
            ? "1 Producto"
            : `${cart?.products?.length} Productos`}
        </span>
      </div>
      <div className={styles.products__wrap}>
        {cart?.products?.map((product, i) => (
          <div className={styles.product} key={i}>
            <div className={styles.product__img}>
              <Image
                src={product.image}
                alt="Mongir Logo"
                width={300}
                height={300}
                loading="lazy"
              />
              <div className={styles.product__infos}>
                <Image
                  width={300}
                  height={200}
                  src={product.color.image}
                  alt="Mongir Logo"
                  loading="lazy"
                />
                <span>{product.size}</span>
                <span>x{product.qty}</span>
              </div>
            </div>
            <div className={styles.product__name}>
              {product.name.length > 18
                ? `${product.name.substring(0, 18)}...`
                : product.name}
            </div>
            {product.price !== product.originalPrice && (
              <span className={styles.priceBefore}>
                COP${formatPrice(product?.originalPrice)}
              </span>
            )}
            <div style={{ display: "flex", gap: "5px", alignItems: "center" }}>
              <div className={styles.product__price}>
                COP ${formatPrice(product.price * product.qty)}
              </div>
              {product.discount > 0 && (
                <span className={styles.discount}>-{product.discount}%</span>
              )}
            </div>
          </div>
        ))}
      </div>
      <div className={styles.products__total}>
        Subtotal : <b>COP ${formatPrice(cart.cartTotal)}</b>
      </div>
    </div>
  );
}
