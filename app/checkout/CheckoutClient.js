"use client";
import { useState, useEffect } from "react";
import styles from "../../styles/checkout.module.scss";
import Shipping from "../../components/checkout/shipping";
import Products from "../../components/checkout/products";
import Payment from "../../components/checkout/payment";
import Summary from "../../components/checkout/summary";
import PaymentMethods from "../../components/cart/paymentMethods";
import Loading from "../loading";

// OR:
export const revalidate = 0; // Revalidate on every request
// OR:

export default function CheckoutClient({ cart, user }) {
  const [paymentMethod, setPaymentMethod] = useState("wompi");
  const [totalAfterDiscount, setTotalAfterDiscount] = useState("");
  const [addresses, setAddresses] = useState(user?.address || []);
  const [selectedAddress, setSelectedAddress] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Scroll to top on initial mount
    window.scrollTo(0, 0);

    // Also handle 'pageshow' event for bfcache
    function handlePageShow(e) {
      // e.persisted indicates bfcache was used
      if (e.persisted) {
        window.scrollTo(0, 0);
      }
    }

    window.addEventListener("pageshow", handlePageShow);
    return () => window.removeEventListener("pageshow", handlePageShow);
  }, [addresses, selectedAddress]);

  useEffect(() => {
    let check = addresses.find((a) => a.active === true);
    if (check) {
      setSelectedAddress(check);
    } else {
      setSelectedAddress("");
    }
  }, [addresses]);

  if (isLoading) {
    return <>{isLoading && <Loading />}</>;
  }

  return (
    <div className={`${styles.container} ${styles.checkout}`}>
      <div className={styles.checkout__side}>
        <Shipping
          user={user}
          addresses={addresses}
          setAddresses={setAddresses}
        />
        {/* <Products cart={cart} /> */}
      </div>
      <div className={styles.checkout__side}>
        <Summary
          totalAfterDiscount={totalAfterDiscount}
          setTotalAfterDiscount={setTotalAfterDiscount}
          user={user}
          cart={cart}
          paymentMethod={paymentMethod}
          selectedAddress={selectedAddress}
          setIsLoading={setIsLoading}
          isLoading={isLoading}
        />
        <PaymentMethods
          setPaymentMethod={setPaymentMethod}
          paymentMethod={paymentMethod}
        />
      </div>
    </div>
  );
}
