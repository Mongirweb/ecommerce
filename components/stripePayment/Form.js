import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import axios from "axios";
import { useState } from "react";
import styles from "./styles.module.scss";
import { ClipLoader } from "react-spinners"; // Example loader
import { useDispatch, useSelector } from "react-redux";
import { emptyCart } from "../../store/cartSlice";
const CARD_OPTIONS = {
  iconStyle: "solid",
  style: {
    base: {
      //iconColor: "#000",
      //color: "#000",
      //fontSize: "16px",
      fontSmoothing: "antialiased",
      //":-webkit-autofill": { color: "#000" },
      //"::placeholder": { color: "#000" },
    },
    invalid: {
      iconColor: "#fd010169",
      color: "#fd010169",
    },
  },
};
export default function Form({ total, order_id }) {
  const [error, setError] = useState("");
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const cart = useSelector((state) => state.cart);
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card: elements.getElement(CardElement),
    });
    if (!error) {
      try {
        const { id } = paymentMethod;
        const res = await axios.post(`/api/order/${order_id}/payWithStripe`, {
          amount: total,
          id,
        });
        setLoading(false);
        if (res.data.success) {
          dispatch(emptyCart());
          window.location.reload(false);
        }
      } catch (error) {
        setLoading(false);
        setError(error);
      }
    } else {
      setLoading(false);
      setError(error.message);
    }
  };

  return (
    <div className={styles.stripe}>
      <form onSubmit={handleSubmit}>
        <CardElement options={CARD_OPTIONS} />
        {loading ? (
          <div className="loader-container">
            <ClipLoader color={"#123abc"} loading={loading} size={30} />
          </div>
        ) : (
          <button type="submit">PAGAR</button>
        )}

        {error && <span className={styles}>{error}</span>}
      </form>
      <style jsx>{`
        .loader-container {
          position: relative;
          width: 100%;
          height: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 9999;
        }
      `}</style>
    </div>
  );
}
