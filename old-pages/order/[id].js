import styles from "../../styles/order.module.scss";
import Header from "../../components/cart/header";
import Order from "../../models/Order";
import User from "../../models/User";
import { IoIosArrowForward } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import db from "../../utils/db";
import {
  PayPalScriptProvider,
  PayPalButtons,
  usePayPalScriptReducer,
} from "@paypal/react-paypal-js";
import { useReducer, useEffect } from "react";
import axios from "axios";
import StripePayment from "../../components/stripePayment";
import { getSession } from "next-auth/react";
import Image from "next/image";
import PendingOutlinedIcon from "@mui/icons-material/PendingOutlined";
import { yellow } from "@mui/material/colors";
import { green } from "@mui/material/colors";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import Head from "next/head";
import Script from "next/script";
import wompi from "../../public/images/wompi.webp";
import { emptyCart } from "../../store/cartSlice";

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
  }
}

export default function Orderr({ orderData, paypal_client_id }) {
  const [{ isPending }, paypalDispatch] = usePayPalScriptReducer();
  const dispa = useDispatch();
  const [dispatch] = useReducer(reducer, {
    loading: true,
    error: "",
    success: "",
  });

  useEffect(() => {
    if (!orderData._id) {
      dispatch({
        type: "PAY_RESET",
      });
    } else {
      paypalDispatch({
        type: "resetOptions",
        value: {
          "client-id": paypal_client_id,
          currency: "USD",
        },
      });
      paypalDispatch({
        type: "setLoadingStatus",
        value: "pending",
      });
    }
  }, [orderData]);

  function createOrderHanlder(data, actions) {
    return actions.order
      .create({
        purchase_units: [
          {
            amount: {
              value: orderData.total,
            },
          },
        ],
      })
      .then((order_id) => {
        return order_id;
      });
  }

  function onApproveHandler(data, actions) {
    return actions.order.capture().then(async function (details) {
      try {
        dispatch({ type: "PAY_REQUEST" });
        const { data } = await axios.put(
          `/api/order/${orderData._id}/pay`,
          details
        );
        dispatch({ type: "PAY_SUCCESS", payload: data });
      } catch (error) {
        dispatch({ type: "PAY_ERROR", payload: error });
      }
    });
  }

  function onErroHandler(error) {
    console.error(error);
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat("de-DE").format(price);
  };

  // Wompi Payment Initialization
  const handleWompiPayment = async () => {
    try {
      const transactionReference = orderData._id; // Use your order's reference
      const amountInCents = orderData.total * 100; // Convert the total amount to cents
      const currency = "COP"; // Wompi currency
      const expirationTime = "2023-06-09T20:28:50.000Z"; // Optional expiration time

      // Get the integrity hash from the backend
      const { data } = await axios.post("/api/wompi/integrity", {
        transactionReference,
        amountInCents,
        currency,
        expirationTime, // Pass the expiration time if necessary
      });

      const integritySignature = data.integritySignature;

      if (typeof window !== "undefined" && window.WidgetCheckout) {
        const checkout = new window.WidgetCheckout({
          currency: "COP",
          amountInCents: amountInCents, // Transaction amount
          reference: transactionReference, // Unique order reference
          publicKey: process.env.NEXT_PUBLIC_PUB_PROD_TEST, // Wompi public key
          signature: { integrity: integritySignature },
          redirectUrl: `${window.location.origin}/order/${orderData._id}`, // Optional redirect URL
        });

        checkout.open((result) => {
          const transaction = result.transaction;
          // if (transaction.status === "APPROVED") {
          //   dispa(emptyCart());
          //   window.location.reload(false);
          // }
        });
      } else {
        console.error("Wompi WidgetCheckout is not available");
      }
    } catch (error) {
      console.error("Error generating Wompi payment:", error);
    }
  };

  // const handleWompiSuccess = async (transaction) => {
  //   try {
  //     dispatch({ type: "PAY_REQUEST" });
  //     const { data } = await axios.put(
  //       `/api/order/${orderData._id}/pay`,
  //       { transactionId: transaction.id } // Send the transaction ID to backend
  //     );
  //     dispatch({ type: "PAY_SUCCESS", payload: data });
  //   } catch (error) {
  //     dispatch({ type: "PAY_ERROR", payload: error });
  //   }
  // };

  // useEffect(() => {
  //   if (!orderData._id) {
  //     dispatch({
  //       type: "PAY_RESET",
  //     });
  //   } else {
  //     paypalDispatch({
  //       type: "resetOptions",
  //       value: {
  //         "client-id": paypal_client_id,
  //         currency: "USD",
  //       },
  //     });
  //     paypalDispatch({
  //       type: "setLoadingStatus",
  //       value: "pending",
  //     });
  //   }
  // }, [orderData]);

  return (
    <>
      <Head>
        {" "}
        <title> SaldoManía | Orden</title>
      </Head>
      <Header />
      <div className={styles.order}>
        <div className={styles.container}>
          <div className={styles.order__infos}>
            <div className={styles.order__header}>
              <div className={styles.order__header_head}>
                Home <IoIosArrowForward /> Ordenes <IoIosArrowForward /> ID{" "}
                {orderData._id}
              </div>
              <div className={styles.order__header_status}>
                Estado del Pago :{" "}
                {orderData.isPaid ? (
                  <CheckCircleOutlineIcon sx={{ color: green[500] }} />
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
                    ? "Pendiente Pago"
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
            </div>
            <div className={styles.order__products}>
              {orderData.products.map((product) => (
                <div className={styles.product} key={product._id}>
                  <div className={styles.product__img}>
                    <Image
                      width={300}
                      height={200}
                      src={product.image}
                      alt={product.name}
                    />
                  </div>
                  <div className={styles.product__infos}>
                    <h1 className={styles.product__infos_name}>
                      {product.name.length > 30
                        ? `${product.name.substring(0, 30)}...`
                        : product.name}
                    </h1>
                    <div className={styles.product__infos_style}>
                      <Image
                        width={300}
                        height={200}
                        src={product.color.image}
                        alt=""
                      />{" "}
                      {product.size ? `/ ${product.size}` : null}
                    </div>
                    <div style={{ display: "flex", gap: "8px" }}>
                      {" "}
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
                    {/* <div className={styles.order__products_total_sub}>
                      <span>Tax price</span>
                      <span>+{orderData.taxPrice}$</span>
                    </div> */}
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
          <div className={styles.order__actions}>
            <div className={styles.order__address}>
              <h1>Información del Cliente</h1>
              <div className={styles.order__address_user}>
                <div className={styles.order__address_user_infos}>
                  <Image
                    width={300}
                    height={200}
                    src={orderData.user.image}
                    alt=""
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
              <div className={styles.order__address_shipping}>
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
              </div>
            </div>
            {!orderData.isPaid && (
              <div className={styles.order__payment}>
                {/* {orderData?.paymentMethod === "paypal" && (
                  <div>
                    {isPending ? (
                      <span>loading...</span>
                    ) : (
                      <PayPalButtons
                        createOrder={createOrderHanlder}
                        onApprove={onApproveHandler}
                        onError={onErroHandler}
                      ></PayPalButtons>
                    )}
                  </div>
                )} */}
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
                      <Image
                        src={wompi}
                        width={50}
                        height={50}
                        alt="saldomania-wompi"
                      />{" "}
                      Pagar con Wompi
                    </button>
                  </>
                )}
                {/* {orderData.paymentMethod == "cash" && (
                  <div className={styles.cash}>cash</div>
                )} */}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export async function getServerSideProps(context) {
  db.connectDb();
  const { query } = context;
  const id = query.id;
  const order = await Order.findById(id)
    .populate({ path: "user", model: User })
    .lean();
  let paypal_client_id = process.env.PAYPAL_CLIENT_ID;
  db.disconnectDb();
  return {
    props: {
      orderData: JSON.parse(JSON.stringify(order)),
      paypal_client_id,
    },
  };
}
