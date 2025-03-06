import { useState, useEffect } from "react";
import styles from "../styles/checkout.module.scss";
import { getSession } from "next-auth/react";
import User from "../models/User";
import Cart from "../models/Cart";
import db from "../utils/db";
import Header from "../components/cart/header";
import Shipping from "../components/checkout/shipping";
import Products from "../components/checkout/products";
import Payment from "../components/checkout/payment";
import Summary from "../components/checkout/summary";
import Head from "next/head";
import Script from "next/script";

export default function Checkout({ cart, user }) {
  const [paymentMethod, setPaymentMethod] = useState("");
  const [totalAfterDiscount, setTotalAfterDiscount] = useState("");
  const [addresses, setAddresses] = useState(user?.address || []);
  const [selectedAddress, setSelectedAddress] = useState("");

  useEffect(() => {
    let check = addresses.find((a) => a.active === true);
    if (check) {
      setSelectedAddress(check);
    } else {
      setSelectedAddress("");
    }
  }, [addresses, selectedAddress]);

  return (
    <>
      <Head>
        <title> SaldoManía | Checkout</title>
      </Head>
      <Header />
      <div className={`${styles.container} ${styles.checkout}`}>
        <div className={styles.checkout__side}>
          <Shipping
            user={user}
            addresses={addresses}
            setAddresses={setAddresses}
          />
          <Products cart={cart} />
        </div>
        <div className={styles.checkout__side}>
          <Payment
            paymentMethod={paymentMethod}
            setPaymentMethod={setPaymentMethod}
          />

          <Summary
            totalAfterDiscount={totalAfterDiscount}
            setTotalAfterDiscount={setTotalAfterDiscount}
            user={user}
            cart={cart}
            paymentMethod={paymentMethod}
            selectedAddress={selectedAddress}
          />
        </div>
      </div>
    </>
  );
}
export async function getServerSideProps(context) {
  const { req } = context;
  try {
    const session = await getSession({ req });
    if (!session) {
      return {
        redirect: {
          destination: "/signin",
          permanent: false,
        },
      };
    }
    db.connectDb();
    const user = await User.findById(session.user.id);
    const cart = await Cart.findOne({ user: user._id });
    db.disconnectDb();
    if (!cart) {
      return {
        redirect: {
          destination: "/cart",
          permanent: false,
        },
      };
    }
    return {
      props: {
        cart: JSON.parse(JSON.stringify(cart)),
        user: JSON.parse(JSON.stringify(user)),
      },
    };
  } catch (error) {
    console.error("Error fetching session or data:", error);
    return {
      redirect: {
        destination: "/error",
        permanent: false,
      },
    };
  }
}
