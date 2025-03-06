import styles from "../../styles/product.module.scss";
import db from "../../utils/db";
import Product from "../../models/Product";
import Category from "../../models/Category";
import SubCategory from "../../models/SubCategory";
import User from "../../models/User";
import Head from "next/head";
import { produceWithPatches } from "immer";
import { useState } from "react";
import { useMediaQuery } from "react-responsive";
import Link from "next/link";
import { NextSeo, OrganizationJsonLd } from "next-seo";
import dynamic from "next/dynamic";
import { useInView } from "react-intersection-observer";
import Header from "../../components/header";
import MainSwiper from "../../components/productPage/mainSwiper";
import MobileSwiper from "../../components/productPage/mobileSwiper";

const Footer = dynamic(() => import("../../components/footer"));

const Infos = dynamic(() => import("../../components/productPage/infos"));
const Reviews = dynamic(() => import("../../components/productPage/reviews"));
const ProductsSwiper = dynamic(() => import("../../components/productsSwiper"));

const SimillarSwiper = dynamic(() =>
  import("../../components/productPage/infos/SimilarSwiper")
);

const SimillarSwiper2 = dynamic(() =>
  import("../../components/productPage/similarSwiper")
);

export async function getServerSideProps(context) {
  const { query } = context;
  const slug = query.slug;
  const style = query.style;
  const size = query?.size || 0;
  await db.connectDb();

  await Product.createIndexes([
    { category: 1 }, // Index on category for faster filtering
    { subProducts: 1 }, // Index on discount for faster queries
    { createdAt: 1 }, // Index on createdAt for sorting
  ]);
  //------------
  let product = await Product.findOne({ slug })
    .populate({ path: "category", model: Category })
    .populate({ path: "subCategories", model: SubCategory })
    .populate({ path: "reviews.reviewBy", model: User })
    .lean();
  let subProduct = product?.subProducts[style];
  let prices = subProduct?.sizes?.length
    ? subProduct.sizes.map((s) => s.price).sort((a, b) => a - b)
    : [];
  let newProduct = {
    ...product,
    style,
    images: subProduct?.images,
    sizes: subProduct?.sizes,
    discount: subProduct?.discount,
    sku: subProduct?.sku,
    colors: product?.subProducts?.map((p) => {
      return p?.color;
    }),
    priceRange: subProduct?.discount
      ? `From ${(prices[0] - prices[0] / subProduct?.discount)?.toFixed(
          2
        )} to ${(
          prices[prices.length - 1] -
          prices[prices.length - 1] / subProduct?.discount
        )?.toFixed(2)}$`
      : `From ${prices[0]} to ${prices[prices.length - 1]}$`,
    price:
      subProduct?.discount > 0
        ? (
            subProduct?.sizes[size]?.price -
            subProduct?.sizes[size]?.price / subProduct?.discount
          )?.toFixed(2)
        : subProduct?.sizes[size]?.price,
    priceBefore: subProduct?.sizes[size]?.price,
    quantity: subProduct?.sizes[size]?.qty,
    ratings: [
      {
        percentage: calculatePercentage("5"),
      },
      {
        percentage: calculatePercentage("4"),
      },
      {
        percentage: calculatePercentage("3"),
      },
      {
        percentage: calculatePercentage("2"),
      },
      {
        percentage: calculatePercentage("1"),
      },
    ],
    reviews: product?.reviews?.reverse(),
    allSizes: product?.subProducts
      .map((p) => {
        return p.sizes;
      })
      .flat()
      .sort((a, b) => {
        return a.size - b.size;
      })
      .filter(
        (element, index, array) =>
          array?.findIndex((el2) => el2?.size === element?.size) === index
      ),
  };
  // fetch similar products based on category and the name
  const similar = await Product.find({
    // Match the same category
    category: product?.category?._id,
    // Exclude the current product from the results
    _id: { $ne: product._id },
    // Match products with similar names (case-insensitive)
    name: { $regex: new RegExp(product.name.split(" ")[0], "i") }, // You can customize this part
    // // Match products with at least one similar color
    // "subProducts.color": { $in: product?.subProducts.map((p) => p?.color) },
  })
    .select("name slug subProducts category") // Only select necessary fields
    .lean();

  // fetch similar products based on brand category and the name
  const sameBrand = await Product.find({
    // Match the same category
    category: product?.category?._id,
    // Exclude the current product from the results
    _id: { $ne: product._id },
    // Match products with similar names (case-insensitive)
    name: { $regex: new RegExp(product.name.split(" ")[0], "i") }, // You can customize this part
    // // Match products with at least one similar color
    // "subProducts.color": { $in: product?.subProducts.map((p) => p?.color) },
  })
    .select("name slug subProducts category") // Only select necessary fields
    .lean();

  // fetch similar products based on category
  const related = await Product.find({
    // Match the same category
    category: product?.category?._id,
    // Exclude the current product from the results
    _id: { $ne: product._id },
    // Match products with similar names (case-insensitive)
  })
    .select("name slug subProducts category") // Only select necessary fields
    .lean();

  //------------
  function calculatePercentage(num) {
    return (
      (product?.reviews?.reduce((a, review) => {
        return (
          a +
          (review?.rating == Number(num) || review?.rating == Number(num) + 0.5)
        );
      }, 0) *
        100) /
      product?.reviews?.length
    ).toFixed(1);
  }

  const openGraphData = [
    {
      property: "og:image",
      content: newProduct?.images[0]?.url,
      key: `ogimage_${newProduct?.images[0]?.url}`,
    },
    {
      property: "og:image:width",
      content: "800",
      key: "ogimagewidth",
    },
    {
      property: "og:image:height",
      content: "600",
      key: "ogimageheight",
    },
    {
      property: "og:url",
      content: `https://www.saldomania.com/product/${product?.slug}?style=${newProduct?.style}`,
      key: "ogurl",
    },
    {
      property: "og:image:secure_url",
      content:
        newProduct.images[0].url || "https://example.com/default-image.jpg",
      key: "ogimagesecureurl",
    },
    {
      property: "og:title",
      content: `${product?.name} - SaldoManía`,
      key: "ogtitle",
    },
    {
      property: "og:description",
      content:
        product?.description ||
        "Explora las mejores ofertas en moda, electrónicos, hogar y más en SaldoManía.",
      key: "ogdesc",
    },
    {
      property: "og:type",
      content: "website",
      key: "website",
    },
  ];
  const title = `SaldoManía - Producto ${product?.name}`;
  const keywords =
    "Saldomania saldo saldos colombia, saldo saldos Ropa colombia, saldo saldos Tienda de moda en línea colombia, saldo saldos saldomania.com, saldo saldos Compras en línea, saldo saldos Ropa de mujer, saldo saldos Hogar y jardín, Joyas y accesorios, saldo saldos Belleza y salud, saldo saldos Electrónica, saldo saldos Ropa para hombres, saldo saldos Moda para niños, saldo saldos Zapatos y bolsos, saldo saldos Suministros para mascotas, saldo saldos Productos para bebés, saldo saldos Deportes y actividades al aire libre, saldo saldos Ropa interior y ropa de dormir, saldo saldos Productos de oficina, saldo saldos Industrial, saldo saldos Automotriz y motocicleta";
  await db.disconnectDb();

  return {
    props: {
      similar: JSON.parse(JSON.stringify(similar)),
      product: JSON.parse(JSON.stringify(newProduct)),
      related: JSON.parse(JSON.stringify(related)),
      openGraphData: JSON.parse(JSON.stringify(openGraphData)),
      title,
      keywords,
    },
  };
}

export default function Productt({ product, related, similar }) {
  const [activeImg, setActiveImg] = useState("");
  const country = {
    name: "Morocco",
    flag: "https://cdn-icons-png.flaticon.com/512/197/197551.png?w=360",
  };

  const query500px = useMediaQuery({
    query: "(max-width:500px)",
  });

  return (
    <>
      <Header country={country} />
      <div className={styles.product}>
        <div className={styles.path}>
          <Link href={"/"} prefetch={true}>
            Home
          </Link>{" "}
          /{" "}
          <Link href={"/"} prefetch={true}>
            {product?.category?.name}
          </Link>
          {product?.subCategories?.map((sub, i) => (
            <span key={i}>
              {" "}
              /{" "}
              <Link href={"/"} prefetch={true}>
                {" "}
                {sub?.name}
              </Link>
            </span>
          ))}
        </div>
        <div className={styles.product__container}>
          <div className={styles.product__main}>
            <div>
              <>
                {query500px ? (
                  <MobileSwiper images={product?.images} />
                ) : (
                  <MainSwiper images={product?.images} activeImg={activeImg} />
                )}
              </>
            </div>
            <div>
              <Infos product={product} setActiveImg={setActiveImg} />
            </div>
          </div>
          <div className={styles.divider}></div>
          <div>
            <SimillarSwiper2
              products={similar}
              header={"Productos similares"}
            />
          </div>
          <div>
            <Reviews product={product} />
          </div>
        </div>
        <div className={styles.product__related}>
          <ProductsSwiper
            products={related}
            header={"Productos relacionados"}
          />
        </div>
      </div>
      <Footer />
    </>
  );
}
