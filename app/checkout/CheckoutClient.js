"use client";
import { useState, useEffect } from "react";
import styles from "../../styles/checkout.module.scss";
import Loading from "../loading";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import dynamic from "next/dynamic";
import MainSwiperSkeleton from "../../components/skeletons/MainSwiperSkeleton";

const Shipping = dynamic(() => import("../../components/checkout/shipping"), {
  ssr: true,
  loading: () => <MainSwiperSkeleton />,
});

const Products = dynamic(() => import("../../components/checkout/products"), {
  ssr: true,
  loading: () => <MainSwiperSkeleton />,
});

const Payment = dynamic(() => import("../../components/checkout/payment"), {
  ssr: true,
  loading: () => <MainSwiperSkeleton />,
});

const Summary = dynamic(() => import("../../components/checkout/summary"), {
  ssr: true,
  loading: () => <MainSwiperSkeleton />,
});

const PaymentMethods = dynamic(
  () => import("../../components/cart/paymentMethods"),
  {
    ssr: true,
    loading: () => <MainSwiperSkeleton />,
  }
);

// OR:
export const revalidate = 0; // Revalidate on every request
// OR:

export default function CheckoutClient({ cart, user, guestToken }) {
  const [paymentMethod, setPaymentMethod] = useState("wompi");
  const [totalAfterDiscount, setTotalAfterDiscount] = useState("");
  const [addresses, setAddresses] = useState(
    !user ? cart.address : user?.address || []
  );
  const [selectedAddress, setSelectedAddress] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const reduxCart = useSelector((state) => state.cart);

  useEffect(() => {
    // If Redux cart is empty, redirect or show a message:
    if (reduxCart?.cartItems?.length === 0) {
      router.replace("/");
    }
  }, [reduxCart, router]);

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
    let check = addresses?.find((a) => a.active === true);
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
          setIsLoading={setIsLoading}
          guestToken={guestToken}
        />
        {/* <Products cart={cart} /> */}
      </div>
      <div className={styles.checkout__side}>
        <Summary
          totalAfterDiscount={totalAfterDiscount}
          setTotalAfterDiscount={setTotalAfterDiscount}
          cart={cart}
          paymentMethod={paymentMethod}
          selectedAddress={selectedAddress}
          setIsLoading={setIsLoading}
          isLoading={isLoading}
          addresses={addresses}
          user={user}
          guestToken={guestToken}
        />
        <PaymentMethods
          setPaymentMethod={setPaymentMethod}
          paymentMethod={paymentMethod}
        />
      </div>
    </div>
  );
}
