// app/product/[slug]/head.tsx
import db from "../../../utils/db";
import Product from "../../../models/Product";
import Category from "../../../models/Category";
import SubCategory from "../../../models/SubCategory";
import SubCategory2 from "../../../models/SubCategory2";
import SubCategory3 from "../../../models/SubCategory3";
import User from "../../../models/User";

export default async function Head({ params, searchParams }) {
  const { slug } = params;
  const style = Number(searchParams?.style ?? 0);
  const size = Number(searchParams?.size ?? 0);

  await db.connectDb();
  const product = await Product.findOne({ slug })
    .populate({ path: "category", model: Category })
    .populate({ path: "subCategories", model: SubCategory })
    .populate({ path: "subCategorie2", model: SubCategory2 })
    .populate({ path: "subCategorie3", model: SubCategory3 })
    .populate({ path: "reviews.reviewBy", model: User })
    .lean();
  await db.disconnectDb();

  if (!product) {
    // if you want, return nothing or minimal head tags
    return null;
  }

  const imgUrl =
    product.subProducts?.[style]?.images?.[0]?.url ||
    "https://res.cloudinary.com/…/default.png";
  const sku = product.subProducts?.[style]?.sku || "";
  const price = product.subProducts?.[style]?.sizes?.[size]?.price || 0;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: [imgUrl],
    sku,
    offers: {
      "@type": "Offer",
      url: `https://www.mongir.com/product/${slug}`,
      price: price.toString(),
      priceCurrency: "COP",
      availability: "https://schema.org/InStock",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <meta property="product:price:amount" content={price.toString()} />
      <meta property="product:price:currency" content="COP" />
    </>
  );
}
