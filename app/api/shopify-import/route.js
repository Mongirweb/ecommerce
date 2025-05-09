// app/api/shopify-import/route.js
import { NextResponse } from "next/server";
import db from "../../../utils/db";
import Product from "../../../models/Product";
import { getAllProducts } from "../../../utils/shopifyImport";
// or wherever you put that helper

export async function POST() {
  try {
    // 1) Connect to DB
    await db.connectDb();

    // 2) Fetch products (array of product nodes)
    const shopifyProducts = await getAllProducts();

    // If you didn't get any products, throw
    if (!shopifyProducts?.length) {
      throw new Error("No products returned from Shopify.");
    }

    let importedCount = 0;
    const manId = "6812bd4cb8bebe69c39bfedc";
    const womenId = "6812bd5bb8bebe69c39bfee2";
    const unisexId = "6812bd6bb8bebe69c39bfee6";

    // 3) Loop over each product *node* (no more `edges` / `node` destructuring)
    for (const shopifyProduct of shopifyProducts) {
      const SHIPPING_PHRASE =
        "INCLUYE ENVÍO GRATIS A TODA COLOMBIA Y CERTIFICADO DE GARANTÍA";

      // si solo quieres quitarla, usa esta función
      const stripShippingPhrase = (text) =>
        text
          .replace(new RegExp(SHIPPING_PHRASE, "gi"), "") // elimina la frase (may/min)
          .replace(/\s{2,}/g, " ") // colapsa espacios dobles
          .trim(); // quita espacios iniciales/finales
      // Basic product fields
      const handle = shopifyProduct.handle;
      const rawTitle = shopifyProduct.title || "Untitled Product";
      const name = rawTitle;
      const description = stripShippingPhrase(shopifyProduct.description) || "";
      const brand = shopifyProduct.vendor || "";
      const slug = handle;
      const tags = shopifyProduct.tags || [];

      // Example fixed IDs; adjust as needed
      const categoryId = "66b683c5c2bd5f4688ba3e71";
      const subCategories = [{ _id: "672be7f5269204da83f3e9d4" }];
      let subCategorie2 = [];
      if (tags.some((t) => t.toLowerCase().includes("unisex"))) {
        subCategorie2 = [{ _id: unisexId }];
      } else if (
        tags.some((t) => {
          const l = t.toLowerCase();
          return (
            l.includes("mujer") || l.includes("women") || l.includes("woman")
          );
        })
      ) {
        subCategorie2 = [{ _id: womenId }];
      } else if (
        tags.some((t) => {
          const l = t.toLowerCase();
          return l.includes("hombre") || l.includes("men") || l.includes("man");
        })
      ) {
        subCategorie2 = [{ _id: manId }];
      } else {
        subCategorie2 = [{ _id: null }];
      }
      const subCategorie3 = [{ _id: null }];
      const companyId = "68127b40aa0de078c57578a0";

      // Gather images
      const imagesEdges = shopifyProduct.images?.edges || [];
      const imageUrls = imagesEdges
        .map((imgEdge) => imgEdge.node?.url?.trim())
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

      // Gather variant data
      const variantEdges = shopifyProduct.variants?.edges || [];
      const inStockVariants = variantEdges.filter(
        ({ node }) => Number(node.quantityAvailable) > 0
      );
      if (!inStockVariants.length) {
        // every variant has 0 qty → skip this product completely
        continue;
      }

      // Map each variant to a subProduct
      const subProducts = inStockVariants.map(({ node: variant }, index) => {
        // Variant basics
        const variantId = variant.id.split("gid://shopify/ProductVariant/")[1];
        const variantSku = variant.sku || "";
        const variantPrice = variant.priceV2?.amount || "0";
        const variantQty = variant.quantityAvailable || 0;
        const variantImageUrl = variant.image?.url || "";

        // Single-image array for this variant
        const variantImageObjects = variantImageUrl
          ? [{ url: variantImageUrl, public_id: "" }]
          : [];

        // Merge product images + variant image only for the first variant
        let imagesForVariant;
        if (index === 0) {
          // first variant => main product images + variant image
          imagesForVariant = [...imageObjects];
          // If you also want the variant’s image appended (and it’s not already in `imageObjects`), do:
          if (variantImageUrl) {
            imagesForVariant.unshift({ url: variantImageUrl, public_id: "" });
          }
        } else {
          // subsequent variants => just the variant’s image
          imagesForVariant = variantImageObjects;
        }

        // e.g. If there's a "Color" option, grab it
        const colorOption = variant.selectedOptions.find(
          (opt) => opt.name.toLowerCase() === "color"
        );
        const colorValue = colorOption?.value || "#ADD8E6";

        return {
          images: imagesForVariant,
          idShopify: variantId,
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
            image: variantImageUrl,
          },
          sizes: [
            {
              qty: Number(variantQty),
              wholesalePrice: 1,
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

      // Upsert product in DB
      await Product.findOneAndUpdate(
        { slug },
        {
          company: companyId,
          name,
          description,
          brand,
          slug,
          category: categoryId,
          subCategories: subCategories,
          subCategorie2,
          fromShopify: true,
          subProducts,
        },
        { upsert: true, new: true, overwrite: true }
      );

      importedCount++;
    }

    // 4) Disconnect & return
    await db.disconnectDb();

    return NextResponse.json({
      success: true,
      message: `Fetched ${shopifyProducts.length} product(s) from Shopify. Imported/updated ${importedCount} in DB.`,
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
