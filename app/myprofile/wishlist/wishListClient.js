// app/wishlist/WishlistClient.jsx
"use client";

import { useState } from "react";
import Layout from "../../../components/profile/layout";
import styles from "../../../styles/profile.module.scss";
import dynamic from "next/dynamic";

const ProductCard = dynamic(() => import("../../../components/productCard"), {
  suspense: true,
});

export default function WishlistClient({ session, tab, wishlist }) {
  const [products, setProducts] = useState(wishlist);

  return (
    <Layout session={session} tab={tab}>
      <div className={styles.header}>
        <h1>Mi lista de deseos</h1>
      </div>
      <div
        className={styles.wishlist}
        style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}
      >
        {products.map((item) => (
          <ProductCard
            key={item._id} // Ensure unique keys
            product={item.productDetails} // Pass product details
            style={item.style} // Pass style if necessary
          />
        ))}
      </div>
    </Layout>
  );
}
