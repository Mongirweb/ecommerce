import { useState } from "react";
import styles from "./styles.module.scss";
import * as Yup from "yup";
import { Form, Formik } from "formik";
import ShippingInput from "../../inputs/shippingInput";
import { applyCoupon } from "../../../requests/user";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function Summary({
  totalAfterDiscount,
  setTotalAfterDiscount,
  user,
  cart,
  paymentMethod,
  selectedAddress,
  setIsLoading,
  isLoading,
}) {
  const [coupon, setCoupon] = useState("");
  const [discount, setDiscount] = useState("");
  const [error, setError] = useState("");
  const [order_error, setOrder_Error] = useState("");
  const router = useRouter();
  const validateCoupon = Yup.object({
    coupon: Yup.string().required("Pleace enter a coupon first !"),
  });
  const applyCouponHandler = async () => {
    const res = await applyCoupon(coupon);
    if (res.message) {
      setError(res.message);
    } else {
      setTotalAfterDiscount(res.totalAfterDiscount);
      setDiscount(res.discount);
      setError("");
    }
  };

  const placeOrderHandler = async () => {
    setIsLoading(true);
    try {
      if (paymentMethod == "") {
        setOrder_Error("Porfavor escoge un metodo de pago.");
        return;
      } else if (!selectedAddress) {
        setOrder_Error("Porfavor añade una dirección de entrega.");
        return;
      }
      const { data } = await axios.post("/api/order/create", {
        products: cart.products,
        shippingAddress: selectedAddress,
        paymentMethod,
        total:
          totalAfterDiscount !== ""
            ? totalAfterDiscount
            : cart.cartTotal + shipping,
        wholeSaleTotal: cart.wholeSaleTotal,
        totalBeforeDiscount: cart.cartTotal,
        couponApplied: coupon,
      });

      router.push(`/order/${data?.order_id}`);
      router.refresh();
    } catch (error) {
      setOrder_Error(error.response.data.message);
    }
  };
  const formatPrice = (price) => {
    return new Intl.NumberFormat("de-DE").format(price);
  };

  const shipping = cart.cartTotal >= 89900 ? 6000 : 12000;

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
              {/* <ShippingInput
                name="coupon"
                placeholder="*Cupon"
                onChange={(e) => setCoupon(e.target.value)}
              />
              {error && <span className={styles.error}>{error}</span>}
              <button className={styles.apply_btn} type="submit">
                Aplicar
              </button> */}
              <div className={styles.infos}>
                <span>
                  Total : <b>${formatPrice(cart.cartTotal + shipping)}</b>{" "}
                </span>
                {discount > 0 && (
                  <span className={styles.coupon_span}>
                    Coupon applied : <b>-{discount}%</b>
                  </span>
                )}
                {totalAfterDiscount < cart.cartTotal &&
                  totalAfterDiscount != "" && (
                    <span>
                      New price : <b>{totalAfterDiscount}$</b>
                    </span>
                  )}
              </div>
            </Form>
          )}
        </Formik>
      </div>
      <button
        className={styles.submit_btn}
        onClick={() => placeOrderHandler()}
        disabled={isLoading}
      >
        Continuar con compra
      </button>
      {order_error && <span className={styles.error}>{order_error}</span>}
    </div>
  );
}
