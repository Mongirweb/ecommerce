import { useEffect, useState } from "react";
import styles from "./styles.module.scss";
import * as Yup from "yup";
import { Form, Formik } from "formik";
import ShippingInput from "../../inputs/shippingInput";
import { applyCoupon, applyGuestCoupon } from "../../../requests/user";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function Summary({
  totalAfterDiscount,
  setTotalAfterDiscount,
  cart,
  paymentMethod,
  selectedAddress,
  setIsLoading,
  addresses,
  isLoading,
  user,
  guestToken,
}) {
  const [coupon, setCoupon] = useState("");
  const [discount, setDiscount] = useState("");
  const [error, setError] = useState("");
  const [order_error, setOrder_Error] = useState("");
  const [shipping, setShipping] = useState("");
  const router = useRouter();
  const validateCoupon = Yup.object({
    coupon: Yup.string().required("Por favor, ingresa un cupón !"),
  });

  const applyCouponHandler = async () => {
    if (user) {
      const res = await applyCoupon(coupon);

      if (res.message) {
        setError(res.message);
      } else {
        setTotalAfterDiscount(+res.totalAfterDiscount);
        setDiscount(+res.discount);
        setError("");
      }
    } else {
      const res = await applyGuestCoupon(coupon, guestToken);

      if (res.message) {
        setError(res.message);
      } else {
        setTotalAfterDiscount(+res.totalAfterDiscount);
        setDiscount(+res.discount);
        setError("");
      }
    }
  };

  useEffect(() => {
    if (!totalAfterDiscount) {
      setShipping(cart?.cartTotal >= 89900 ? 5000 : 10000);
    } else {
      setShipping(totalAfterDiscount >= 89900 ? 5000 : 10000);
    }
  }, [cart?.cartTotal, totalAfterDiscount]);

  const placeOrderHandler = async (e) => {
    e.preventDefault();
    try {
      if (paymentMethod == "") {
        setOrder_Error("Porfavor escoge un metodo de pago.");
        return;
      } else if (!selectedAddress) {
        setOrder_Error("Porfavor añade una dirección de entrega.");
        return;
      }
      setIsLoading(true);
      if (!user) {
        const { data } = await axios.post("/api/order/createGuest", {
          products: cart.products,
          shippingAddress: selectedAddress,
          paymentMethod,
          total:
            totalAfterDiscount !== ""
              ? totalAfterDiscount + shipping
              : cart?.cartTotal + shipping,
          wholeSaleTotal: cart?.wholeSaleTotal,
          totalBeforeDiscount: cart?.cartTotal,
          couponApplied: coupon,
          shippingPrice: shipping,
          token: guestToken,
        });

        router.push(`/order/${data?.order_id}`);
      } else {
        const { data } = await axios.post("/api/order/create", {
          products: cart.products,
          shippingAddress: selectedAddress,
          paymentMethod,
          total:
            totalAfterDiscount !== ""
              ? totalAfterDiscount + shipping
              : cart?.cartTotal + shipping,
          wholeSaleTotal: cart?.wholeSaleTotal,
          totalBeforeDiscount: cart?.cartTotal,
          couponApplied: coupon,
          shippingPrice: shipping,
        });

        router.push(`/order/${data?.order_id}`);
      }
    } catch (error) {
      setOrder_Error(error.response.data.message);
    }
  };
  const formatPrice = (num) =>
    new Intl.NumberFormat("es-ES", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0, // 👈 nunca muestra ,x
    }).format(num);

  return (
    <div className={styles.summary}>
      <div className={styles.header}>
        <h3></h3>
      </div>
      <div className={styles.coupon}>
        <Formik
          enableReinitialize
          initialValues={{ coupon }}
          validationSchema={validateCoupon}
          onSubmit={() => {
            applyCouponHandler();
          }}
        >
          {(formik) => (
            <Form>
              <ShippingInput
                name="coupon"
                placeholder="*Cupon"
                onChange={(e) => setCoupon(e.target.value)}
              />
              {error && <span className={styles.error}>{error}</span>}
              <button className={styles.apply_btn} type="submit">
                Aplicar
              </button>
              <div className={styles.infos}>
                <span style={{ fontSize: "14px" }}>
                  Total artículos: <b>${formatPrice(cart?.cartTotal)}</b>
                </span>
                {discount > 0 && (
                  <span
                    className={styles.coupon_span}
                    style={{ fontSize: "14px" }}
                  >
                    Cupón : <b>-{discount}%</b>
                  </span>
                )}

                {totalAfterDiscount < cart?.cartTotal &&
                  totalAfterDiscount != "" && (
                    <span style={{ fontSize: "14px" }}>
                      Descuento en artículos:{" "}
                      <b style={{ color: "#fbb922" }}>
                        - ${formatPrice(cart?.cartTotal - totalAfterDiscount)}
                      </b>
                    </span>
                  )}
                {totalAfterDiscount < cart?.cartTotal &&
                  totalAfterDiscount != "" && (
                    <span style={{ fontSize: "14px" }}>
                      Subtotal: <b>${formatPrice(totalAfterDiscount)}</b>
                    </span>
                  )}
                <span style={{ fontSize: "14px" }}>
                  Envío:
                  <b style={{ fontSize: "14px" }}>${formatPrice(shipping)} </b>
                </span>
                <span style={{ fontSize: "14px" }}>
                  Total:
                  <b style={{ fontSize: "14px" }}>
                    $
                    {formatPrice(
                      totalAfterDiscount
                        ? totalAfterDiscount + shipping
                        : cart?.cartTotal + shipping
                    )}{" "}
                  </b>
                </span>
              </div>
            </Form>
          )}
        </Formik>
      </div>
      <button
        type="button"
        className={styles.submit_btn}
        onClick={placeOrderHandler}
        disabled={isLoading}
      >
        Continuar con compra
      </button>
      {order_error && <span className={styles.error}>{order_error}</span>}
    </div>
  );
}
