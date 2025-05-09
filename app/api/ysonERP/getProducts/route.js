// app/api/shopify-import/route.js
import { NextResponse } from "next/server";

import slugify from "slugify";
import db from "../../../../utils/db";
import Product from "../../../../models/Product";
// your function that fetches from Shopify

// Helper function similar to your CSV version, to capitalize each word
function capitalizeEachWord(str) {
  if (!str) return "";
  return str
    .split(/\s+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

export async function POST(req) {
  try {
    // 1) Connect to DB
    await db.connectDb();

    // 2) Fetch products from Shopify
    //    Structure: response => { products: { edges: [ { node: {...} }, ... ] } }
    const body = await req.json();
    const { products } = body;

    if (!products?.length) {
      throw new Error("No products returned.");
    }

    let importedCount = 0;

    // 3) Loop over each product from Shopify
    for (const { product } of products) {
      const slugOptions = {
        lower: true,
        strict: true,
        remove: /[*+~.()'"!:@,]/g,
      };
      const generatedSlug = slugify(product?.nombre_producto, slugOptions);
      // --- A) Basic product fields ---
      const handle = generatedSlug;
      const rawTitle = product.nombre_producto || "Untitled Product";
      const name = capitalizeEachWord(rawTitle); // same approach as CSV
      const description = product.descripcion_producto || "";
      const brand = product.marca_producto || "";
      const slug = handle; // or some other unique slug logic

      // Example fixed IDs; adjust as needed:
      const categoryId = "66b6841dc2bd5f4688ba3eac";
      const subCategories = [{ _id: "672bec62269204da83f3ebac" }];
      const subCategorie2 = [{ _id: null }];
      const subCategorie3 = [{ _id: null }];
      const companyId = "678adddb31fbbeba54ca6269";

      // --- B) Gather images ---
      // In your query, you're fetching (first: 1) images;
      // if you want more, update to (first: 10) or 250 in getProducts()
      const images = product.images || [];
      const imageUrls = images.map((img) => img?.trim()).filter(Boolean);

      // Convert to your desired format
      const imageObjects = imageUrls.map((url) => ({
        url,
        public_id: "",
      }));

      // --- C) Gather variant data ---
      // Again, your query uses (first: 1). If a product has multiple variants,
      // you may want to fetch them all (first: 250) and map them into multiple subProducts
      const variants = product?.variantes || [];
      if (!variants.length) {
        // If no variants, skip or create a default subProduct
        continue;
      }

      // Here we map each variant to a `subProduct` object
      // If your schema only expects *one* subProduct, pick the first variant
      const subProducts = variants.map((variant) => {
        const id = variant.id_producto_variante || "";
        const variantSku = variant?.plu || "";
        const variantPrice = product.precio_producto || "0";
        const variantQty = variant?.inventario || 0;
        const variantImageUrl = variant?.imagen || "";
        const variantName = variant?.nombre_variante || "";
        const size = variant?.talla || "";
        const variantWeight = product?.peso_producto || "0";
        const variantGender = product?.genero_producto || "";
        const variantWholeSaleProce = product?.precio_producto_x_mayor || 0;

        // 2) Convert it to your array of image objects
        const variantImageObjects = variantImageUrl
          ? [{ url: variantImageUrl, public_id: "" }]
          : [];

        // Example: color from the first selectedOption or fallback

        const colorValue = variant?.color || "#ADD8E6";

        return {
          images: variantImageObjects,
          idYesion: id,
          description_images: [],
          gender: variantGender || "Sin género",
          warranty: { number: 6 },
          weight: variantWeight || "0.2",
          flashOffer: "No",
          chargeMarket: 0,
          measures: {
            long: 15,
            width: 10,
            high: 5,
            volumetric_weight: "",
          },
          color: {
            color: colorValue,
            image: imageUrls[0], // for example
          },
          sizes: [
            {
              size,
              qty: Number(variantQty),
              wholesalePrice: variantWholeSaleProce,
              price: Number(variantPrice),
              sku: variantSku,
              universalCode: variantSku,
              priceWithDiscount: 0,
              priceWithDiscountFlash: 0,
            },
          ],
          discount: 0,
          variant: variantName || "Default Variant",
          flashDiscount: 0,
          sold: 0,
          soldInFlash: 0,
          totalSold: 0,
        };
      });

      // --- D) Upsert product in DB (like your CSV code) ---
      const upsertResult = await Product.findOneAndUpdate(
        { slug },
        {
          company: companyId,
          name: name,
          description: description,
          brand,
          slug,
          category: categoryId,
          subCategories,
          fromShopify: false,
          subProducts,
        },
        { upsert: true, new: true }
      );

      console.log(upsertResult);

      importedCount++;
    }

    // 4) Close DB & return success
    await db.disconnectDb();

    return NextResponse.json({
      success: true,
      message: `Fetched ${products?.length} product(s) from YsonERP. Imported/updated ${importedCount} in DB.`,
    });
  } catch (error) {
    console.error(error);
    await db.disconnectDb();
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
