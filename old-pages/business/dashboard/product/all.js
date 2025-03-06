import styles from "../../../../styles/products.module.scss";
import Layout from "../../../../components/business/layout";
import db from "../../../../utils/db";
import Product from "../../../../models/Product";
import Category from "../../../../models/Category";
import ProductCard from "../../../../components/business/products/productCard";
import Head from "next/head";
export default function all({ products }) {
  return (
    <Layout>
      <Head>
        <title>SaldoManía - Mis Productos</title>
      </Head>
      <div className={styles.header}>Mis Productos</div>
      {products?.map((product) => (
        <ProductCard product={product} key={product._id} />
      ))}
    </Layout>
  );
}

export async function getServerSideProps(ctx) {
  await db.connectDb();
  const products = await Product.find({})
    .populate({ path: "category", model: Category })
    .sort({ createdAt: -1 })
    .lean();
  await db.disconnectDb();
  return {
    props: {
      products: JSON.parse(JSON.stringify(products)),
    },
  };
}
