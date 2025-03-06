"use client";
import styles from "./styles.module.scss";
import Rating from "@mui/material/Rating";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { LuMinus } from "react-icons/lu";
import { LuPlus } from "react-icons/lu";
import { useEffect } from "react";
import { BsHandbagFill, BsHeart } from "react-icons/bs";
import Share from "./share";
import Accordian from "./Accordian";
import SimillarSwiper from "./SimilarSwiper";
import axios from "axios";
import DialogModal from "../../dialogModal";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, updateCart } from "../../../store/cartSlice";
import { hideDialog, showDialog } from "../../../store/DialogSlice";
import { signIn, useSession } from "next-auth/react";
import Image from "next/image";
import { FaFireFlameCurved } from "react-icons/fa6";
export default function Infos({ product, setActiveImg, company }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const dispatch = useDispatch();
  const { data: session } = useSession();
  // Retrieve 'style' and 'size' from searchParams
  const styleParam = searchParams.get("style") || 0;
  const sizeParam = searchParams.get("size") || "";
  const [size, setSize] = useState(sizeParam);
  const [qty, setQty] = useState(1);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const cart = useSelector((state) => state.cart);

  useEffect(() => {
    dispatch(hideDialog());
  }, [dispatch]);

  useEffect(() => {
    setSize(sizeParam || ""); // Ensure size is cleared only if there's no size query
    setQty(1);
  }, [sizeParam]);

  useEffect(() => {
    if (qty > product.quantity) {
      setQty(product.quantity);
    }
  }, [product.quantity, qty]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat("de-DE").format(price);
  };

  const addToCartHandler = async () => {
    if (!sizeParam) {
      setError("Porfavor selecciona una talla.");
      return;
    }
    const { data } = await axios.get(
      `/api/product/${product._id}?style=${product.style}&size=${sizeParam}`
    );

    if (qty > data.quantity) {
      setError(
        "La cantidad que haz escogido es mayor a la disponible, por favor escoge menos."
      );
    } else if (data.quantity < 1) {
      setError("Este producto no esta disponible.");
      return;
    } else {
      let _uid = `${data._id}_${product.style}_${sizeParam}`;
      let exist = cart?.cartItems?.find((p) => p._uid === _uid);
      if (exist) {
        let newCart = cart.cartItems.map((p) => {
          if (p._uid == exist._uid) {
            return { ...p, qty: qty };
          }
          return p;
        });
        dispatch(updateCart(newCart));
      } else {
        dispatch(
          addToCart({
            ...data,
            qty,
            size: data.size,
            _uid,
          })
        );
      }

      // Show dialog with options to continue shopping or check cart
      dispatch(
        showDialog({
          header: "Añadido al carrito",
          msgs: [
            {
              msg: (
                <div style={{ display: "flex", gap: "1rem" }}>
                  <Image
                    src={data.images?.[0]?.url}
                    alt={data.name}
                    style={{
                      width: "80px",
                      height: "80px",
                      objectFit: "cover",
                    }}
                    width={80}
                    height={80}
                  />
                  <div>
                    <div style={{ fontWeight: "bold" }}>{data.name}</div>
                    <div>Cantidad: {qty}</div>
                    <div>Precio: ${formatPrice(data.price)}</div>
                  </div>
                </div>
              ),
              type: "info",
            },
          ],
          link: {
            link: "/cart",
            text: "Ir al Carrito",
            link2: "/",
            text2: "Seguir Comprando",
          },
        })
      );
    }
  };

  const handleWishlist = async () => {
    try {
      if (!session) {
        return signIn();
      }
      const { data } = await axios.put("/api/user/wishlist", {
        product_id: product._id,
        style: product.style,
      });
      dispatch(
        showDialog({
          header: "Producto añadido a tu lista de deseos",
          msgs: [
            {
              msg: (
                <>
                  <button
                    onClick={() =>
                      router.push("/myprofile/wishlist?tab=2&q=me-gusta")
                    }
                    style={{ marginRight: "10px", padding: "10px 20px" }}
                  >
                    Ver Lista de Deseos
                  </button>
                  <button
                    onClick={() => router.push("/")}
                    style={{ padding: "10px 20px" }}
                  >
                    Continuar comprando
                  </button>
                </>
              ),
              type: "info",
            },
          ],
        })
      );
    } catch (error) {
      dispatch(
        showDialog({
          header: "Error",
          msgs: [
            {
              msg: error.response.data.message,
              type: "error",
            },
          ],
        })
      );
    }
  };

  return (
    <div className={styles.infos}>
      <DialogModal />
      <div className={styles.infos__container}>
        <div className={styles.infos__container_infos}>
          <h1 className={styles.infos__container_infos_name}>
            {product?.name}
          </h1>
          <div className={styles.infos__container_infos_company}>
            {company ? (
              <>
                <p>Vendido por: </p>

                <Image
                  src={company?.image}
                  width={50}
                  height={50}
                  alt="somoselhueco-company"
                  loading="lazy"
                />
                <span>{company?.businessName || company?.name}</span>
              </>
            ) : null}
          </div>
          {/* <h2 className={styles.infos__sku}>{product.sku}</h2> */}
          <div className={styles.infos__container_infos_rating}>
            <Rating
              name="half-rating-read"
              defaultValue={product?.rating}
              precision={0.5}
              readOnly
              style={{ color: "#FACF19" }}
              size="large"
              sx={{ border: "1px", width: "90px" }}
            />
            ({product.numReviews}
            {product.numReviews == 1 ? " review" : " reviews"})
          </div>
          <div className={styles.infos__container_infos_price}>
            {size === 0 ? (
              <h2>{product.priceRange}</h2>
            ) : (
              <h1>$ {formatPrice(product.price)}</h1>
            )}
            {product.discount > 0 ? (
              <h3>
                {size && <span>${formatPrice(product.priceBefore)}</span>}
                <span>(-{product.discount}%)</span>
              </h3>
            ) : (
              ""
            )}
          </div>

          <div className={styles.infos__container_infos_colors}>
            {product?.colors?.length > 1 ? (
              <h4>Selecciona un color: </h4>
            ) : null}
            <div className={styles.infos__container_infos_colors_wrap}>
              {product?.colors?.length > 1 &&
                product?.colors?.map((color, i) => (
                  <span
                    key={i}
                    className={i == styleParam ? styles?.active_color : ""}
                    onMouseOver={() =>
                      setActiveImg(product.subProducts[i].images[0].url)
                    }
                    onMouseLeave={() => setActiveImg("")}
                  >
                    <Link
                      href={`/product/${product.slug}?style=${i}&size=${0}`}
                      replace
                      prefetch={true}
                      scroll={false}
                    >
                      <Image
                        src={color.image}
                        alt="somoselhueco-color-producto"
                        width={300}
                        height={300}
                        loading="lazy"
                      />
                      <p>{color.variant}</p>
                    </Link>
                  </span>
                ))}
            </div>
          </div>
          <div className={styles.infos__container_infos_sizes}>
            {product?.sizes[0]?.size ? <h4>Selecciona una Talla: </h4> : null}
            <div className={styles.infos__container_infos_sizes_wrap}>
              {product?.sizes[0]?.size
                ? product?.sizes?.map((size, i) => (
                    <Link
                      href={`/product/${product.slug}?style=${styleParam}&size=${i}`}
                      key={i}
                      replace
                      scroll={false}
                    >
                      <div
                        className={`${
                          styles.infos__container_infos_sizes_size
                        } ${i == sizeParam && styles?.active_size}`}
                        onClick={() => setSize(size.size)}
                      >
                        {size.size}
                      </div>
                    </Link>
                  ))
                : null}
            </div>
          </div>
          <Accordian details={[product?.description, ...product?.details]} />
        </div>
        <div className={styles.infos__container_action}>
          <span className={styles.infos__container_action_shipping}>
            {product.shipping
              ? `+ $${product.shipping} costo de envío`
              : "Oferta especial, envío gratis!"}
          </span>
          <span className={styles.infos__container_action_quantity}>
            {size
              ? product?.quantity > 1
                ? `${
                    ((<FaFireFlameCurved />), "Quedan pocas unidades, apurate!")
                  }`
                : "Agotado"
              : product?.sizes?.reduce((start, next) => start + next.qty, 0) > 1
              ? "Disponible"
              : product?.sizes?.reduce((start, next) => start + next.qty, 0) ===
                1
              ? "Solo queda 1, apurate!"
              : "Agotado"}{" "}
          </span>
          <div className={styles.infos__container_action_qty}>
            Cantidad:
            <button onClick={() => qty > 1 && setQty((prev) => prev - 1)}>
              <p>-</p>
            </button>
            <span>{qty}</span>
            <button
              onClick={() =>
                qty < product.quantity && setQty((prev) => prev + 1)
              }
            >
              <p>+</p>
            </button>
          </div>
          <div className={styles.infos__container_action_actions}>
            <button
              disabled={product.quantity < 1}
              style={{ cursor: `${product.quantity < 1 ? "not-allowed" : ""}` }}
              onClick={() => addToCartHandler()}
            >
              <BsHandbagFill />
              <b>Añadir al carrito</b>
            </button>
            {/* <button onClick={() => handleWishlist()}>
              <BsHeart />
              Agregar lista de deseos
            </button> */}
          </div>
          <div className={styles.seller_info}>
            <div className={styles.seller_img}></div>
            <div className={styles.seller_infos}></div>
          </div>
          {error && <span className={styles.error}>{error}</span>}
          {success && <span className={styles.success}>{success}</span>}
          <Share />
        </div>
      </div>
    </div>
  );
}
