// File: app/order/[id]/OrderPage.jsx

"use client";

import styles from "../../../styles/order.module.scss";
import Header from "../../../components/cart/header";
import { IoIosArrowForward } from "react-icons/io";
import { useDispatch } from "react-redux";
import {
  PayPalScriptProvider,
  PayPalButtons,
  usePayPalScriptReducer,
} from "@paypal/react-paypal-js";
import { useReducer, useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";
import PendingOutlinedIcon from "@mui/icons-material/PendingOutlined";
import { yellow } from "@mui/material/colors";
import { green } from "@mui/material/colors";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import Script from "next/script";
import wompi from "../../../public/images/wompi.webp";
import { emptyCart } from "../../../store/cartSlice";
import { useRouter } from "next/navigation";
import { IoMdArrowBack } from "react-icons/io";
import { useWindowSize } from "react-use";

export default function OrderClientPage({ orderData }) {
  const router = useRouter();
  const formatPrice = (price) => {
    return new Intl.NumberFormat("de-DE").format(price);
  };
  const [shipping, setShipping] = useState(0);
  useEffect(() => {
    const shippingPrice = orderData.total - orderData.totalBeforeDiscount;
    setShipping(shippingPrice);
  }, [orderData]);

  return (
    <>
      <Header />

      <div className={styles.order}>
        <div className={styles.container}>
          <div className={styles.order__infos}>
            <div className={styles.goBack} onClick={() => router.back()}>
              <IoMdArrowBack />
              Volver
            </div>
            {/* Order Header */}
            <div className={styles.order__header}>
              <div className={styles.order__header_head}>
                Home <IoIosArrowForward /> Ordenes <IoIosArrowForward /> ID{" "}
                {orderData._id}
              </div>
              <div className={styles.order__header_status}>
                Estado del Pago :{" "}
                {orderData.isPaid ? (
                  <span
                    style={{
                      color: green[500],
                      display: "flex",
                      alignItems: "center",
                      gap: "5px",
                      fontWeight: "bold",
                    }}
                  >
                    Compra aprobada{" "}
                    <CheckCircleOutlineIcon sx={{ color: green[500] }} />
                  </span>
                ) : (
                  <PendingOutlinedIcon sx={{ color: yellow[500] }} />
                )}
              </div>
              <div className={styles.order__header_status}>
                Estado de la Orden :
                <span
                  className={
                    orderData.status === "Not Processed"
                      ? styles.not_processed
                      : orderData.status === "Processing"
                      ? styles.processing
                      : orderData.status === "Dispatched"
                      ? styles.dispatched
                      : orderData.status === "Cancelled"
                      ? styles.cancelled
                      : orderData.status === "Completed"
                      ? styles.completed
                      : ""
                  }
                >
                  {orderData.status === "Not Processed"
                    ? "Pendiente de Pago"
                    : orderData.status === "Processing"
                    ? "Procesando"
                    : orderData.status === "Dispatched"
                    ? "Enviado"
                    : orderData.status === "Cancelled"
                    ? "Cancelado"
                    : orderData.status === "Completed"
                    ? "Completado"
                    : orderData.status}
                </span>
              </div>
              {orderData?.trackingInfo?.trackingUrl && (
                <div className={styles.order__header_status}>
                  Estado del envío :
                  <span
                    style={{ fontWeight: "bold", textDecoration: "underline" }}
                  >
                    <a
                      href={orderData.trackingInfo.trackingUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Rastrear envío
                    </a>
                  </span>
                </div>
              )}
            </div>
            {/* Order Products */}
            <div className={styles.order__products}>
              {orderData.products.map((product) => (
                <div className={styles.product} key={product._id}>
                  <div className={styles.product__img}>
                    <Image
                      width={300}
                      height={200}
                      src={product.image}
                      alt={product.name}
                      loading="lazy"
                    />
                  </div>
                  <div className={styles.product__infos}>
                    <h1 className={styles.product__infos_name}>
                      {product.name.length > 30
                        ? `${product.name.substring(0, 30)}...`
                        : product.name}
                    </h1>
                    <h1 className={styles.product__infos_name}>
                      Variante:
                      {product.variant.length > 30
                        ? `${product.variant.substring(0, 30)}...`
                        : product.variant}
                    </h1>
                    <div className={styles.product__infos_style}>
                      <Image
                        width={300}
                        height={200}
                        src={product.color.image}
                        alt="Somos-el-hueco-medellin-compra-virtual-producto-online-en-linea-somoselhueco"
                        loading="lazy"
                      />{" "}
                      {product.size ? `/ ${product.size}` : null}
                    </div>
                    <div style={{ display: "flex", gap: "8px" }}>
                      {product.price !== Number(product.originalPrice) && (
                        <span className={styles.priceBefore}>
                          COP${formatPrice(product?.originalPrice)}
                        </span>
                      )}
                      {product.discount > 0 && (
                        <span className={styles.discount}>
                          -{product.discount}%
                        </span>
                      )}
                    </div>
                    <div className={styles.product__infos_priceQty}>
                      COP ${formatPrice(product.price)} x {product.qty}
                    </div>
                    <div className={styles.product__infos_total}>
                      COP ${formatPrice(product.price * product.qty)}
                    </div>
                  </div>
                </div>
              ))}
              {/* Order Total */}
              <div className={styles.order__products_total}>
                {orderData.couponApplied ? (
                  <>
                    <div className={styles.order__products_total_sub}>
                      <span>Subtotal</span>
                      <span>{orderData.totalBeforeDiscount}$</span>
                    </div>
                    <div className={styles.order__products_total_sub}>
                      <span>
                        Coupon Applied <em>({orderData.couponApplied})</em>{" "}
                      </span>
                      <span>
                        -
                        {(
                          orderData.totalBeforeDiscount - orderData.total
                        ).toFixed(2)}
                        $
                      </span>
                    </div>
                    <div className={styles.order__products_total_sub}>
                      <span>Tax price</span>
                      <span>+{orderData.taxPrice}$</span>
                    </div>
                    <div
                      className={`${styles.order__products_total_sub} ${styles.bordertop}`}
                    >
                      <span>Total</span>
                      <b>{orderData.total}$</b>
                    </div>
                  </>
                ) : (
                  <>
                    <div className={styles.order__products_total_sub}>
                      <span>Envío</span>
                      <span>${formatPrice(shipping)}</span>
                    </div>
                    <div
                      className={`${styles.order__products_total_sub} ${styles.bordertop}`}
                    >
                      <span>Total:</span>
                      <b>COP ${formatPrice(orderData.total)}</b>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
          {/* Order Actions */}
          <div className={styles.order__actions}>
            <div className={styles.order__address}>
              <h1>Información del Cliente</h1>
              <div className={styles.order__address_user}>
                <div className={styles.order__address_user_infos}>
                  <Image
                    width={300}
                    height={200}
                    src={orderData.user.image}
                    alt="Somos-el-hueco-medellin-compra-virtual-producto-online-en-linea-somoselhueco"
                    loading="lazy"
                  />
                  <div>
                    <span>{orderData.user.name}</span>
                    <span>{orderData.user.email}</span>
                  </div>
                </div>
              </div>
              <div className={styles.order__address_shipping}>
                <h2>Dirección de envío</h2>
                <span>
                  {orderData.shippingAddress.firstName}{" "}
                  {orderData.shippingAddress.lastName}
                </span>
                <span>{orderData.shippingAddress.address1}</span>
                <span>{orderData.shippingAddress.address2}</span>
                <span>
                  {orderData.shippingAddress.state},
                  {orderData.shippingAddress.city}
                </span>
                <span>{orderData.shippingAddress.zipCode}</span>
                <span>{orderData.shippingAddress.country}</span>
              </div>
              {/* <div className={styles.order__address_shipping}>
                <h2>Dirección de facturación</h2>
                <span>
                  {orderData.shippingAddress.firstName}{" "}
                  {orderData.shippingAddress.lastName}
                </span>
                <span>{orderData.shippingAddress.address1}</span>
                <span>{orderData.shippingAddress.address2}</span>
                <span>
                  {orderData.shippingAddress.state},
                  {orderData.shippingAddress.city}
                </span>
                <span>{orderData.shippingAddress.zipCode}</span>
                <span>{orderData.shippingAddress.country}</span>
              </div> */}
            </div>
            {!orderData.isPaid && (
              <div className={styles.order__payment}>
                {orderData.paymentMethod === "wompi" && (
                  <>
                    <Script
                      src="https://checkout.wompi.co/widget.js"
                      strategy="lazyOnload"
                      onLoad={() => {
                        console.log("Wompi widget script loaded successfully");
                      }}
                    />
                    <button
                      onClick={handleWompiPayment}
                      className={styles.wompiButton}
                    >
                      Pagar
                    </button>
                  </>
                )}
                {/* PayPal Payment */}
                {/* {orderData.paymentMethod === "paypal" && (
              <PayPalScriptProvider
                options={{
                  "client-id": paypal_client_id,
                  currency: "USD",
                }}
              >
                {isPending ? (
                  <div>Loading PayPal...</div>
                ) : (
                  <PayPalButtons
                    createOrder={createOrderHandler}
                    onApprove={onApproveHandler}
                    onError={onErrorHandler}
                  />
                )}
              </PayPalScriptProvider>
            )} */}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
