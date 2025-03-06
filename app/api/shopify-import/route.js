// app/api/shopify-import/route.js
import { NextResponse } from "next/server";
import db from "../../../utils/db";
import Product from "../../../models/Product";
import { getProducts } from "../../../utils/shopifyImport"; // your function that fetches from Shopify

// Helper function similar to your CSV version, to capitalize each word
function capitalizeEachWord(str) {
  if (!str) return "";
  return str
    .split(/\s+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

export async function POST() {
  try {
    // 1) Connect to DB
    await db.connectDb();

    // 2) Fetch products from Shopify
    //    Structure: response => { products: { edges: [ { node: {...} }, ... ] } }
    const response = await getProducts();

    if (!response?.products?.edges?.length) {
      throw new Error("No products returned from Shopify.");
    }

    const edges = response.products.edges;
    let importedCount = 0;

    // 3) Loop over each product from Shopify
    for (const { node: shopifyProduct } of edges) {
      // --- A) Basic product fields ---
      const handle = shopifyProduct.handle;
      const rawTitle = shopifyProduct.title || "Untitled Product";
      const name = capitalizeEachWord(rawTitle); // same approach as CSV
      const description = shopifyProduct.description || "";
      const brand = shopifyProduct.vendor || "";
      const slug = handle; // or some other unique slug logic

      // Example fixed IDs; adjust as needed:
      const categoryId = "66b683c5c2bd5f4688ba3e71";
      const subCategories = [{ _id: "672be7e4269204da83f3e9ce" }];
      const subCategorie2 = [{ _id: "672e63bb10b35e38d4833aa6" }];
      const subCategorie3 = [{ _id: null }];
      const companyId = "67b6850eb14a2d3a0b58e220";

      // --- B) Gather images ---
      // In your query, you're fetching (first: 1) images;
      // if you want more, update to (first: 10) or 250 in getProducts()
      const imagesEdges = shopifyProduct.images?.edges || [];
      const imageUrls = imagesEdges
        .map((imgEdge) => imgEdge.node.url?.trim())
        .filter(Boolean);
      if (!imageUrls.length) {
        // If no images, skip creation or handle as you prefer
        continue;
      }
      // Convert to your desired format
      const imageObjects = imageUrls.map((url) => ({
        url,
        public_id: "",
      }));

      // --- C) Gather variant data ---
      // Again, your query uses (first: 1). If a product has multiple variants,
      // you may want to fetch them all (first: 250) and map them into multiple subProducts
      const variantEdges = shopifyProduct.variants?.edges || [];
      if (!variantEdges.length) {
        // If no variants, skip or create a default subProduct
        continue;
      }

      // Here we map each variant to a `subProduct` object
      // If your schema only expects *one* subProduct, pick the first variant
      const subProducts = variantEdges.map(({ node: variant }) => {
        const id = variant.id.split("gid://shopify/ProductVariant/")[1];
        const variantSku = variant.sku || "";
        const variantPrice = variant.priceV2?.amount || "0";
        const variantQty = variant.quantityAvailable || 0;
        const variantImageUrl = variant.image?.url || "";

        // 2) Convert it to your array of image objects
        const variantImageObjects = variantImageUrl
          ? [{ url: variantImageUrl, public_id: "" }]
          : [];

        // Example: color from the first selectedOption or fallback
        const colorOption = variant.selectedOptions.find(
          (opt) => opt.name.toLowerCase() === "color"
        );
        const colorValue = colorOption?.value || "#ADD8E6";

        return {
          images: variantImageObjects,
          idShopify: id,
          description_images: [],
          gender: "Sin género",
          warranty: { number: 6 },
          weight: "0.2",
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
              qty: Number(variantQty),
              wholesalePrice: 0,
              price: Number(variantPrice),
              sku: variantSku,
              universalCode: variantSku,
              priceWithDiscount: 0,
              priceWithDiscountFlash: 0,
            },
          ],
          discount: 0,
          variant: variant.title || "Default Variant",
          flashDiscount: 0,
          sold: 0,
          soldInFlash: 0,
          totalSold: 0,
        };
      });

      // --- D) Upsert product in DB (like your CSV code) ---
      await Product.findOneAndUpdate(
        { slug },
        {
          company: companyId,
          name: name,
          description: description,
          brand,
          slug,
          category: categoryId,
          subCategories,
          subCategorie2,
          fromShopify: true,
          subProducts,
        },
        { upsert: true, new: true, overwrite: true }
      );

      importedCount++;
    }

    // 4) Close DB & return success
    await db.disconnectDb();

    return NextResponse.json({
      success: true,
      message: `Fetched ${edges.length} product(s) from Shopify. Imported/updated ${importedCount} in DB.`,
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
