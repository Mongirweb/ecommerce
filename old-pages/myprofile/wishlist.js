import { getSession } from "next-auth/react";
import Layout from "../../components/profile/layout";
import User from "../../models/User";
import styles from "../../styles/profile.module.scss";
import { useState } from "react";
import Product from "../../models/Product";
import dynamic from "next/dynamic";

const ProductCard = dynamic(() => import("../../components/productCard"), {
  suspense: true,
});
export default function Whishlist({ user, tab }) {
  const [products, setProducts] = useState(user.wishlist);

  return (
    <Layout session={user.user} tab={tab}>
      <div className={styles.header}>
        <h1>Mi lista de deseos</h1>
      </div>
      <div
        className={styles.wishlist}
        style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}
      >
        {products.map((item) => (
          <ProductCard
            key={item._id} // Key should be unique for each item
            product={item.productDetails} // Pass the product details to ProductCard
            style={item.style} // Pass style if needed
          />
        ))}
      </div>
    </Layout>
  );
}

export async function getServerSideProps(ctx) {
  const { query, req } = ctx;
  const session = await getSession({ req });
  const tab = query.tab || 0;
  //--------------
  const products = await User.findById(session.user.id)
    .select("wishlist")
    .lean();

  // Populate the wishlist with product details
  const wishlistWithDetails = await Promise.all(
    products.wishlist.map(async (item) => {
      const productDetails = await Product.findById(item.product).lean();
      return {
        ...item,
        productDetails,
      };
    })
  );

  return {
    props: {
      user: {
        user: session.user,
        wishlist: JSON.parse(JSON.stringify(wishlistWithDetails)),
      },
      tab,
    },
  };
}
