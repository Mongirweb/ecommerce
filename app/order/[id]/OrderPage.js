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
import Confetti from "react-confetti-boom";
import { toast } from "react-toastify";
import Link from "next/link";

function reducer(state, action) {
  switch (action.type) {
    case "PAY_REQUEST":
      return { ...state, loading: true };
    case "PAY_SUCCESS":
      return { ...state, loading: false, success: true };
    case "PAY_FAIL":
      return { ...state, loading: false, error: action.payload };
    case "PAY_RESET":
      return { ...state, loading: false, success: false, error: false };
    default:
      return state;
  }
}

export default function OrderPage({ orderData, paypal_client_id }) {
  const { width, height } = useWindowSize();
  const dispatchRedux = useDispatch();

  const [state, dispatch] = useReducer(reducer, {
    loading: true,
    error: "",
    success: "",
  });

  const router = useRouter();

  function createOrderHandler(data, actions) {
    return actions.order
      .create({
        purchase_units: [
          {
            amount: { value: orderData.total },
          },
        ],
      })
      .then((order_id) => order_id);
  }

  function onApproveHandler(data, actions) {
    return actions.order.capture().then(async (details) => {
      try {
        dispatch({ type: "PAY_REQUEST" });
        const { data } = await axios.put(
          `/api/order/${orderData._id}/pay`,
          details
        );
        dispatch({ type: "PAY_SUCCESS", payload: data });
      } catch (error) {
        dispatch({ type: "PAY_FAIL", payload: error });
      }
    });
  }

  function onErrorHandler(error) {
    console.error(error);
  }

  useEffect(() => {
    if (orderData?.isPaid) {
      toast.success("Orden Aprobada!");
    } else {
      return;
    }
  }, [orderData]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat("de-DE").format(price);
  };

  const checkProductQuantities = async () => {
    try {
      const { data } = await axios.post(
        "/api/user/checkQuantityProductsOrder",
        {
          products: orderData.products,
        }
      );

      if (data.products.length > 0) {
        const outOfStockProducts = data.products
          .map((p) => `${p?.name} Talla(${p?.size})`)
          .join(", ");
        toast.error(
          `Los siguientes productos no tienen suficiente stock: ${outOfStockProducts}`
        );
        return false;
      } else {
        handleWompiPayment();
      }
    } catch (error) {
      console.error("Error checking product quantities:", error);
      toast.error("Error verificando el stock de productos");
      return false;
    }
  };

  // Wompi Payment Initialization
  const handleWompiPayment = async () => {
    try {
      const transactionReference = orderData._id;
      const amountInCents = orderData.total * 100;
      const currency = "COP";
      const expirationTime = "2023-06-09T20:28:50.000Z";

      // Get the integrity hash from the backend
      const { data } = await axios.post("/api/wompi/integrity", {
        transactionReference,
        amountInCents,
        currency,
        expirationTime,
      });

      const integritySignature = data.integritySignature;

      if (typeof window !== "undefined" && window.WidgetCheckout) {
        const checkout = new window.WidgetCheckout({
          currency: "COP",
          amountInCents,
          reference: transactionReference,
          publicKey: process.env.NEXT_PUBLIC_PUB_PROD,
          signature: { integrity: integritySignature },
          redirectUrl: `${window.location.origin}/order/${orderData._id}`,
        });

        checkout.open((result) => {
          const transaction = result.transaction;
          if (transaction.status === "APPROVED") {
            dispatchRedux(emptyCart());
            router.replace(`/order/${orderData._id}`);
          }
        });
      } else {
        console.error("Wompi WidgetCheckout is not available");
      }
    } catch (error) {
      console.error("Error generating Wompi payment:", error);
    }
  };

  const shipping = orderData.totalBeforeDiscount >= 89900 ? 6000 : 12000;

  return (
    <>
      <Header />
      {orderData?.isPaid && (
        <Confetti
          mode="boom"
          particleCount={2000}
          colors={["#ff003c", "#00ff03", "#f0d50c", "#02e1f7"]}
          spreadDeg={200}
          launchSpeed={2}
          y={0.3}
          shapeSize={16}
        />
      )}
      <div className={styles.order}>
        <div className={styles.container}>
          <div className={styles.order__infos}>
            <Link className={styles.goBack} href="/">
              <IoMdArrowBack />
              Volver
            </Link>
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
                  "Pendiente de pago"
                )}
              </div>
              <div className={styles.order__header_status}>
                Estado de la Orden :
                <span
                  className={
                    orderData.status === "Procesando"
                      ? styles.processing
                      : orderData.status === "Exitoso"
                      ? styles.dispatched
                      : orderData.status === "Cancelado"
                      ? styles.cancelled
                      : orderData.status === "Exitoso"
                      ? styles.completed
                      : ""
                  }
                >
                  {orderData.status === "Procesando"
                    ? "Procesando"
                    : orderData.status === "Cancelado"
                    ? "Cancelado"
                    : orderData.status === "Exitoso"
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
                      Revisar
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
                      {product.variant === "Default Title"
                        ? null
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
                          ${formatPrice(product?.originalPrice)}
                        </span>
                      )}
                      {product.discount > 0 && (
                        <span className={styles.discount}>
                          -{product.discount}%
                        </span>
                      )}
                    </div>
                    <div className={styles.product__infos_priceQty}>
                      ${formatPrice(product.price)} x {product.qty}
                    </div>
                    <div className={styles.product__infos_total}>
                      ${formatPrice(product.price * product.qty)}
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
                      {shipping === 6000 && (
                        <span
                          style={{
                            color: "#1b5e20",
                            display: "flex",
                            gap: "5px",
                            alignItems: "center",
                          }}
                        >
                          ${formatPrice(shipping)}
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
                      {shipping === 12000 && (
                        <span
                          style={{
                            color: "#1b5e20",
                            display: "flex",
                            gap: "5px",
                            alignItems: "center",
                          }}
                        >
                          ${formatPrice(shipping)}
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
                    <div
                      className={`${styles.order__products_total_sub} ${styles.bordertop}`}
                    >
                      <span>Total:</span>
                      <b>${formatPrice(orderData.total)}</b>
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
                      onClick={checkProductQuantities}
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
