// app/product/[slug]/page.js

export const dynamic = "force-dynamic";
import db from "../../../utils/db";
import Product from "../../../models/Product";
import Category from "../../../models/Category";
import SubCategory from "../../../models/SubCategory";
import SubCategory2 from "../../../models/SubCategory2";
import SubCategory3 from "../../../models/SubCategory3";
import User from "../../../models/User";
import ProductPageContent from "./ProductPageContent";
import { customMetaDataGenerator } from "../../components/customMetaDataGenerator";
import { notFound } from "next/navigation";

export async function generateMetadata({ params, searchParams }) {
  const { slug } = params;
  const { style = "0", size = "0" } = searchParams;

  try {
    await db.connectDb();

    const product = await Product.findOne({ slug })
      .populate({ path: "category", model: Category })
      .populate({ path: "subCategories", model: SubCategory })
      .populate({ path: "subCategorie2", model: SubCategory2 })
      .populate({ path: "subCategorie3", model: SubCategory3 })
      .populate({ path: "reviews.reviewBy", model: User })
      .lean();

    if (!product) {
      return notFound();
    }

    const title = `${product.name} - Compra ahora en Somos el Hueco Medellín`;
    const description =
      product.description ||
      "Encuentra los Mejores Productos del Hueco de Medellin sin Salir de Casa | Compra en línea";
    const imageUrl =
      product.subProducts?.[0]?.images?.[0]?.url ||
      "https://res.cloudinary.com/danfiejkv/image/upload/v1737325171/somos-el-hueco-medellin-logo-cuadrado_kfecc1.png";

    // Create keywords as a comma-separated string
    const keywords = [
      product?.name,
      product?.category?.name,
      ...(product?.subCategories?.map((sub) => sub?.name) || ""),
      ...(product?.subCategorie2?.map((sub) => sub?.name) || ""),
      ...(product?.subCategorie3?.map((sub) => sub?.name) || ""),
      "Somos el Hueco Medellín",
      "El Hueco de Medellín",
      "somoselhueco",
      "somos el hueco",
      "el hueco medellín",
      "el hueco Colombia",
      "comprar en el hueco somos el hueco",
      "somoselhueco",
      "el hueco virtual",
      "centro comercial el hueco",
      "compras en línea el hueco",
      "compra online el hueco",
      "tienda en línea el hueco",
      "compra al por mayor en el hueco",
      "mayoristas en el hueco",
      "tiendas en el hueco medellín",
      "productos en el hueco medellín",
      "mapa el hueco medellin",
      "como comprar en el hueco",
      "descuentos en el hueco",
      "ofertas el hueco",
      "promociones el hueco",
    ]
      .filter(Boolean)
      .join(", ");

    const canonicalUrl = `https://www.somoselhueco.com/product/${product?.slug}`;

    // Optional: Build structured data for the product using schema.org's Product type.
    const structuredData = {
      "@context": "http://schema.org",
      "@type": "Product",
      name: product.name,
      description: product.description,
      image: imageUrl,
      sku: product.subProducts?.[0]?.sku || "",
      offers: {
        "@type": "Offer",
        url: canonicalUrl,
        priceCurrency: "COP",
        // Assumes that product.subProducts[0].sizes is an array and you pick a price by index
        price: product.subProducts?.[0]?.sizes?.[size]?.price || "0",
        availability: "https://schema.org/InStock", // Adjust based on your stock data
      },
    };

    return {
      title,
      description,
      keywords,
      openGraph: {
        title,
        description,
        url: canonicalUrl,
        siteName: "Somos el Hueco Medellín",
        images: [
          {
            url: imageUrl,
            width: 200,
            height: 200,
            alt: title,
          },
        ],
        locale: "es_CO",
        type: "website",
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: [imageUrl],
      },
      alternates: {
        canonical: canonicalUrl,
        languages: {
          "es-CO": canonicalUrl,
        },
      },
      // Inject JSON-LD structured data into a script tag in the head.
      other: {
        "application/ld+json": JSON.stringify(structuredData),
      },
    };
  } catch (error) {
    console.error("Error in generateMetadata:", error);
    throw new Error("500");
  } finally {
    await db.disconnectDb();
  }
}

export default async function ProductPage({ params, searchParams }) {
  const { slug } = params;
  const style = searchParams?.style || 0;
  const size = searchParams?.size || 0;

  function formatPrice(price) {
    return new Intl.NumberFormat("es-ES", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  }

  // A helper to calculate rating percentages
  function calculatePercentage(num, reviews) {
    if (!reviews?.length) return 0;
    return (
      (reviews.reduce((acc, review) => {
        return (
          acc +
          (review?.rating === Number(num) ||
            review?.rating === Number(num) + 0.5)
        );
      }, 0) *
        100) /
      reviews.length
    ).toFixed(1);
  }

  try {
    await db.connectDb();

    const product = await Product.findOne({ slug })
      .populate({ path: "category", model: Category })
      .populate({ path: "subCategories", model: SubCategory })
      .populate({ path: "subCategorie2", model: SubCategory2 })
      .populate({ path: "subCategorie3", model: SubCategory3 })
      .populate({ path: "reviews.reviewBy", model: User })
      .lean();

    if (!product) {
      // If there's truly no product, a 404 makes sense:
      return notFound();
    }

    const subProduct = product?.subProducts?.[style];
    const prices = subProduct?.sizes?.length
      ? subProduct.sizes.map((s) => s.price).sort((a, b) => a - b)
      : [];

    // Optionally, if you want to simulate/force a 500 error for debugging:
    // throw new Error("Simulated 500 error for testing");

    const newProduct = {
      ...product,
      style,
      images: subProduct?.images,
      sizes: subProduct?.sizes,
      discount: subProduct?.discount,
      sku: subProduct?.sku,
      colors: product?.subProducts?.map((p) => {
        return { ...p?.color, variant: p?.variant };
      }),
      priceRange: subProduct?.discount
        ? `Desde $${formatPrice(
            prices[0] - (prices[0] * subProduct?.discount) / 100
          )} hasta $${formatPrice(
            prices[prices.length - 1] -
              (prices[prices.length - 1] * subProduct?.discount) / 100
          )}`
        : `Desde $${formatPrice(prices[0])} hasta $${formatPrice(
            prices[prices.length - 1]
          )}`,
      price:
        subProduct?.discount > 0
          ? (
              subProduct?.sizes[size]?.price -
              (subProduct?.sizes[size]?.price * subProduct?.discount) / 100
            )?.toFixed(2)
          : subProduct?.sizes[size]?.price,
      priceBefore: subProduct?.sizes[size]?.price,
      quantity: subProduct?.sizes[size]?.qty,
      ratings: [
        { percentage: calculatePercentage("5", product?.reviews) },
        { percentage: calculatePercentage("4", product?.reviews) },
        { percentage: calculatePercentage("3", product?.reviews) },
        { percentage: calculatePercentage("2", product?.reviews) },
        { percentage: calculatePercentage("1", product?.reviews) },
      ],
      reviews: product?.reviews?.reverse(),
      allSizes: product?.subProducts
        ?.map((p) => p?.sizes)
        .flat()
        .sort((a, b) => a.size - b.size)
        .filter(
          (element, index, array) =>
            array.findIndex((el2) => el2.size === element.size) === index
        ),
    };

    // Optionally retrieve the company/user info
    const companyId = product?.company;
    const company = companyId ? await User.findById(companyId).lean() : null;

    return (
      <ProductPageContent
        product={JSON.parse(JSON.stringify(newProduct))}
        company={JSON.parse(JSON.stringify(company))}
        similar={[]}
        related={[]}
        country={{
          name: "Morocco",
          flag: "https://cdn-icons-png.flaticon.com/512/197/197551.png?w=360",
        }}
      />
    );
  } catch (error) {
    console.error("Error in ProductPage:", error);
    // Throwing an error with a 500-like message triggers
    // your custom error page at app/error.js
    throw new Error("500 - Internal Server Error");
  } finally {
    await db.disconnectDb();
  }
}
