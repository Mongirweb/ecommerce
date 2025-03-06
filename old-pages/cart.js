import React, { useEffect, useState } from "react";
import styles from "../styles/cart.module.scss";
import Footer from "../components/footer";
import Header from "../components/cart/header";
import Empty from "../components/cart/empty";
import ProductsSwiper from "../components/productsSwiper";
import { women_swiper } from "../data/home";
import { useRouter } from "next/router";
import { getSession, signIn, useSession } from "next-auth/react";
import { useDispatch, useSelector } from "react-redux";
import CartHeader from "../components/cart/cartHeader";
import Product from "../components/cart/products";
import Checkout from "../components/cart/checkout";
import PaymentMethods from "../components/cart/paymentMethods";
import axios from "axios";
import { emptyCart, updateCart } from "../store/cartSlice";
import { saveCart } from "../requests/user";
import Head from "next/head";

export default function Cart() {
  const Router = useRouter();
  const { data: session } = useSession();
  const [selected, setSelected] = useState([]);
  const cart = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const [similarProducts, setSimilarProducts] = useState([]);
  //-----------------------
  const [shippingFee, setShippingFee] = useState(0);
  const [subtotal, setSubtotal] = useState(0);
  const [total, setTotal] = useState(0);

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

  useEffect(() => {
    setShippingFee(
      selected.reduce((a, c) => a + Number(c.shipping), 0).toFixed(2)
    );
    setSubtotal(selected.reduce((a, c) => a + c.price * c.qty, 0).toFixed(2));
    setTotal(
      (
        selected.reduce((a, c) => a + c.price * c.qty, 0) + Number(shippingFee)
      ).toFixed(2)
    );
  }, [selected, dispatch, cart]);

  // -----------------------
  const saveCartToDbHandler = async () => {
    if (session) {
      const res = await saveCart(selected);
      Router.push("/checkout");
    } else {
      signIn();
      // signIn(null, { callbackUrl: "/checkout" });
    }
  };

  return (
    <>
      <Head>
        <title> SaldoManía | Carrito</title>
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
            <PaymentMethods />
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

// export async function getServerSideProps(context) {
//   db.connectDb();

//   const session = await getSession(context);

//   let cartItems = []; // Replace with your logic to get the cart items from session or database

//   // Assuming cartItems is populated with products from the cart
//   let similarProducts = [];

//   // Fetch similar products for each cart item
//   if (cartItems.length > 0) {
//     try {
//       // Fetch similar products for each item in the cart
//       const promises = cartItems.map(async (item) => {
//         const similar = await Product.find({
//           category: item.category?._id,
//           _id: { $ne: item._id },
//           name: { $regex: new RegExp(item.name.split(" ")[0], "i") }, // Customize as needed
//         })
//           .select("name slug subProducts category")
//           .lean();
//         return similar;
//       });

//       // Wait for all promises to resolve and flatten the result
//       const results = await Promise.all(promises);
//       similarProducts = results.flat();
//     } catch (error) {
//       console.error("Error fetching similar products:", error);
//     }
//   }

//   const openGraphData = [
//     {
//       property: "og:image",
//       content: newProduct.images[0].url,
//       key: `ogimage_${newProduct.images[0].url}`,
//     },
//     {
//       property: "og:image:width",
//       content: "800",
//       key: "ogimagewidth",
//     },
//     {
//       property: "og:image:height",
//       content: "600",
//       key: "ogimageheight",
//     },
//     {
//       property: "og:url",
//       content: `https://www.saldomania.com/product/${product?.slug}?style=${newProduct?.style}`,
//       key: "ogurl",
//     },
//     {
//       property: "og:image:secure_url",
//       content:
//         newProduct.images[0].url || "https://example.com/default-image.jpg",
//       key: "ogimagesecureurl",
//     },
//     {
//       property: "og:title",
//       content: `${product?.name} - SaldoMania`,
//       key: "ogtitle",
//     },
//     {
//       property: "og:description",
//       content:
//         product?.description ||
//         "Explora las mejores ofertas en moda, electrónicos, hogar y más en SaldoMania.",
//       key: "ogdesc",
//     },
//     {
//       property: "og:type",
//       content: "website",
//       key: "website",
//     },
//   ];
//   const title = `SaldoMania - Producto ${product?.name}`;
//   const keywords =
//     "Saldomania saldo saldos, saldo saldos Ropa, saldo saldos Tienda de moda en línea, saldo saldos saldomania.com, saldo saldos Compras en línea, saldo saldos Ropa de mujer, saldo saldos Hogar y jardín, Joyas y accesorios, saldo saldos Belleza y salud, saldo saldos Electrónica, saldo saldos Ropa para hombres, saldo saldos Moda para niños, saldo saldos Zapatos y bolsos, saldo saldos Suministros para mascotas, saldo saldos Productos para bebés, saldo saldos Deportes y actividades al aire libre, saldo saldos Ropa interior y ropa de dormir, saldo saldos Productos de oficina, saldo saldos Industrial, saldo saldos Automotriz y motocicleta";
//   db.disconnectDb();

//   return {
//     props: {
//       similarProducts,
//     },
//   };
// }
