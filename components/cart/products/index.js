import styles from "./styles.module.scss";
import { BsHeart } from "react-icons/bs";
import { AiOutlineDelete } from "react-icons/ai";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { updateCart } from "../../../store/cartSlice";
import { useState, useEffect } from "react";
import { saveCart } from "../../../requests/user";
import Image from "next/image";
import Link from "next/link";

export default function Product({ product, selected, setSelected, session }) {
  const cart = useSelector((state) => state.cart);
  const [active, setActive] = useState();

  useEffect(() => {
    const check = selected.find((p) => p._uid === product._uid);
    setActive(check);
  }, [selected, product._uid]);

  const dispatch = useDispatch();

  const updateQty = (type) => {
    // Update the local cart store
    const newCart = cart.cartItems.map((p) => {
      if (p._uid === product._uid) {
        return {
          ...p,
          qty: type === "plus" ? product.qty + 1 : product.qty - 1,
        };
      }
      return p;
    });
    dispatch(updateCart(newCart));
  };

  const removeProduct = async (id) => {
    let newCart = cart.cartItems.filter((p) => {
      return p._uid != id;
    });
    if (session) {
      const res = await saveCart(newCart);
      if (res) {
        dispatch(updateCart(newCart));
      } else {
        return;
      }
    } else {
      dispatch(updateCart(newCart));
    }
  };

  const handleSelect = () => {
    if (active) {
      setSelected(selected.filter((p) => p._uid !== product._uid));
    } else {
      setSelected([...selected, product]);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("de-DE").format(price);
  };

  return (
    <div className={`${styles.card} ${styles.product}`}>
      {product?.quantity < 1 && <div className={styles.blur}></div>}

      <div className={styles.product__header}>
        <Image
          src="/images/store.webp"
          alt="cart-item-somoselhueco"
          width={300}
          height={300}
          loading="lazy"
        />
        Somos el Hueco Marketplace
      </div>
      <div className={styles.product__image}>
        <div></div>
        <Link
          href={`/product/${product.slug}?style=${product.style || 0}&size=0`}
        >
          <Image
            width={300}
            height={300}
            loading="lazy"
            src={product?.images[0].url}
            alt="producto-product-somoselhueco-saldo-saldos"
          />
        </Link>
        <div className={styles.col}>
          <div className={styles.grid}>
            <h1>
              {product?.name?.length > 30
                ? `${product.name.substring(0, 30)}`
                : product.name}
            </h1>

            {/* <div style={{ zIndex: "2" }}>
              <BsHeart />
            </div> */}
            <div
              style={{ zIndex: "2" }}
              onClick={() => removeProduct(product._uid)}
            >
              <AiOutlineDelete />
            </div>
          </div>
          <div className={styles.product__variant}>
            <p>{product.variant === "Default Title" ? "" : product.variant}</p>
          </div>
          <div className={styles.product__style}>
            <Image
              width={300}
              height={300}
              src={product.color.image}
              alt="somoselhueco-saldo-producto-style"
              loading="lazy"
            />
            {product.size && <span>{product.size}</span>}
            {product.price && <span>COP ${formatPrice(product.price)}</span>}
            <MdOutlineKeyboardArrowRight />
          </div>
          <div className={styles.product__priceQty}>
            <div className={styles.product__priceQty_price}>
              <span className={styles.price}>
                COP ${formatPrice(product.price * product.qty)}
              </span>
              {product.price !== product.priceBefore && (
                <span className={styles.priceBefore}>
                  COP${formatPrice(product?.priceBefore)}
                </span>
              )}
              {product.discount > 0 && (
                <span className={styles.discount}>-{product.discount}%</span>
              )}
            </div>
            <div className={styles.product__priceQty_qty}>
              <button
                disabled={product.qty < 2}
                onClick={() => updateQty("minus")}
              >
                -
              </button>
              <span>{product.qty}</span>
              <button
                disabled={product.qty === product.quantity}
                onClick={() => updateQty("plus")}
              >
                +
              </button>
            </div>
          </div>
          <div className={styles.product__shipping}>
            {product.shipping
              ? `+${product.shipping}$ Shipping fee`
              : "Envío gratis"}
          </div>
          <div className={styles.product__advert}>
            {product.quantity === 1 && "Solo queda 1 apurate!"}
          </div>
          {product.quantity < 1 && (
            <div className={styles.notAvailable}>
              Este producto no tiene stock, eliminalo para continuar
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
