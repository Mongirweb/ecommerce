"use client";
import React, { useEffect, useState } from "react";
import styles from "../../styles/cart.module.scss";
import Header from "../../components/header";
import Empty from "../../components/cart/empty";
import { getSession, signIn, useSession } from "next-auth/react";
import { useDispatch, useSelector } from "react-redux";
import CartHeader from "../../components/cart/cartHeader";
import Product from "../../components/cart/products";
import Checkout from "../../components/cart/checkout";
import PaymentMethods from "../../components/cart/paymentMethods";
import axios from "axios";
import { updateCart } from "../../store/cartSlice";
import { saveCart } from "../../requests/user";
import Head from "next/head";
import { useRouter } from "next/navigation";
import Loading from "../loading";
import { toast } from "react-toastify";

export default function Cart() {
  const router = useRouter();
  const { data: session } = useSession();
  const [selected, setSelected] = useState([]);
  const cart = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const [paymentMethod, setPaymentMethod] = useState("wompi");
  const [isLoading, setIsLoading] = useState(false);
  const [similarProducts, setSimilarProducts] = useState([]);
  //-----------------------
  const [shippingFee, setShippingFee] = useState(0);
  const [subtotal, setSubtotal] = useState(0);
  const [total, setTotal] = useState(0);

  // Update cart items on mount or whenever cart changes.
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
  }, []);

  useEffect(() => {
    const update = async () => {
      const { data } = await axios.post("/api/updateCart", {
        products: cart?.cartItems,
      });
      dispatch(updateCart(data));
    };

    if (cart?.cartItems?.length > 0) {
      update();
    }
  }, [dispatch]);

  // Recalculate totals for ALL items in the cart.
  useEffect(() => {
    const sub = cart?.cartItems?.reduce(
      (acc, item) => acc + item.price * item.qty,
      0
    );
    setShippingFee(sub.toFixed(2) < 89900 ? 12000 : 6000);
    setSubtotal(sub.toFixed(2));
    setTotal((sub + shippingFee).toFixed(2));
  }, [cart?.cartItems, cart, shippingFee]);

  // -----------------------
  const saveCartToDbHandler = async () => {
    if (session) {
      try {
        // Pass all items in cart instead of 'selected'
        const checkQuantityProducts = await axios.post(
          "/api/user/checkQuantityProducts",
          {
            products: cart.cartItems,
          }
        );
        if (checkQuantityProducts.data.products.length > 0) {
          // setIsLoading(false);

          const outOfStockProducts = checkQuantityProducts.data.products
            .map((p) => `${p?.name} Talla(${p?.size})`)
            .join(", ");
          toast.error(
            `Los siguientes productos no tienen suficiente stock: ${outOfStockProducts}`
          );
          router.refresh();
        } else {
          setIsLoading(true);
          const res = await saveCart(cart.cartItems);
          if (res) {
            router.push("/checkout");
            router.refresh();
          }
        }
      } catch (error) {
        console.error(error);
      }
    } else {
      signIn();
      // or signIn(null, { callbackUrl: "/checkout" });
    }
  };
  if (isLoading) {
    return <>{isLoading && <Loading />}</>;
  }
  return (
    <>
      <Head>
        <title> Mongir | Carrito</title>
      </Head>
      <Header />

      <div className={styles.cart}>
        {cart?.cartItems?.length > 0 ? (
          <div className={styles.cart__container}>
            <CartHeader
              cartItems={cart?.cartItems}
              selected={selected}
              setSelected={setSelected}
            />
            <div className={styles.cart__products}>
              {cart?.cartItems?.map((product) => (
                <Product
                  product={product}
                  key={product._uid}
                  selected={selected}
                  setSelected={setSelected}
                  session={session}
                />
              ))}
            </div>
            <Checkout
              subtotal={subtotal}
              shippingFee={shippingFee}
              total={total}
              selected={selected}
              saveCartToDbHandler={saveCartToDbHandler}
            />
            <PaymentMethods
              setPaymentMethod={setPaymentMethod}
              paymentMethod={paymentMethod}
            />
          </div>
        ) : (
          <Empty />
        )}
        {/* <ProductsSwiper
          products={similarProducts}
          header={"Relacionado con tu compra"}
        /> */}
      </div>
    </>
  );
}
