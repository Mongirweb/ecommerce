// app/api/update-variants/route.js
import { NextResponse } from "next/server";
import db from "../../../utils/db";
import Product from "../../../models/Product";
import { somos } from "../../../data/somos"; // Adjust path as needed

export async function POST() {
  try {
    await db.connectDb();

    let updatedCount = 0;

    for (const item of somos) {
      // 1) Find product by subProducts.sizes.sku == item.plu
      if (!item.plu) continue;
      const product = await Product.findOne({
        "subProducts.sizes.sku": item.plu.trim(),
      });
      if (!product) {
        // If not found, skip
        console.log(`No product found for PLU: ${item.plu}`);
        continue;
      }

      // 2) Check if this JSON product has variants
      if (!item.variantes || item.variantes.length === 0) {
        // If no variantes, do nothing
        console.log(`Product [${item.plu}] found, but no variantes. Skipped.`);
        continue;
      }

      // 3) We'll treat the *first* variant in JSON as subProducts[0]
      const [firstVariant, ...otherVariants] = item.variantes;
      if (!firstVariant) {
        // If, for some reason, variantes is empty after destructuring, skip
        continue;
      }

      // Make sure product.subProducts[0] exists
      if (!product.subProducts?.length) {
        console.log(`Product [${item.plu}] has no subProducts[0]. Skipped.`);
        continue;
      }

      // a) Combine images: the product's main image + the first variant image
      //    We'll store them in subProducts[0].images array
      const mainImageUrl = item.imagen_url?.trim() || "";
      const firstVariantImg = firstVariant.imagen_variante?.trim() || "";
      const existingSub = product.subProducts[0];

      // Save references to the existing price data (which user wants to keep)
      const mainWholesale = existingSub.sizes[0]?.wholesalePrice || 0;
      const mainPrice = existingSub.sizes[0]?.price || 0;
      const mainPriceWithDiscount =
        existingSub.sizes[0]?.priceWithDiscount || 0;
      const mainPriceWithDiscountFlash =
        existingSub.sizes[0]?.priceWithDiscountFlash || 0;

      // b) Update subProducts[0] images
      //    We'll replace them with two entries if both URLs exist
      const newImagesArray = [];
      if (firstVariantImg && firstVariantImg !== mainImageUrl) {
        newImagesArray.push({ url: firstVariantImg, public_id: "" });
      }
      if (mainImageUrl) {
        newImagesArray.push({ url: mainImageUrl, public_id: "" });
      }

      existingSub.images = newImagesArray.length
        ? newImagesArray
        : existingSub.images;

      // c) Update subProducts[0].variant name
      existingSub.variant = firstVariant.variante || "Variant Title";

      existingSub.color.image = firstVariantImg || "Variant Title";

      // d) Update subProducts[0].sizes[0]
      if (existingSub.sizes?.length) {
        existingSub.sizes[0].qty = 50; // set stock to 50

        // We keep the same price data from subProducts[0] (mainWholesale, mainPrice, etc.)
        // So we do NOT overwrite them with new values from the JSON item.
      }

      // e) Build new subProducts for the *other* variants
      const newVariants = otherVariants.map((variant) => {
        const varImg = variant.imagen_variante?.trim() || "";
        const varName = variant.variante || "Variant Title";
        const varPlu = variant.plu_variante?.trim() || "";

        return {
          images: [{ url: varImg, public_id: "" }],
          idShopify: null,
          description_images: [],
          gender: "Sin género",
          warranty: { number: 1 },
          weight: "0.1",
          flashOffer: "No",
          chargeMarket: 0,
          measures: {
            long: 15,
            width: 10,
            high: 5,
            volumetric_weight: "",
          },
          color: {
            color: "#ADD8E6",
            image: varImg,
          },
          sizes: [
            {
              qty: 50,
              sku: varPlu,
              universalCode: varPlu,
              // The user wants the same wholesalePrice/price from subProducts[0]
              wholesalePrice: mainWholesale,
              price: mainPrice,
              priceWithDiscount: mainPriceWithDiscount,
              priceWithDiscountFlash: mainPriceWithDiscountFlash,
            },
          ],
          discount: 0,
          variant: varName,
          flashDiscount: 0,
          sold: 0,
          soldInFlash: 0,
          totalSold: 0,
        };
      });

      // f) Append these new subProducts
      product.subProducts.push(...newVariants);

      // 4) Save
      await product.save();
      updatedCount++;
      console.log(
        `Updated product [${item.plu}] with ${
          1 + otherVariants.length
        } total variants.`
      );
    }

    await db.disconnectDb();

    return NextResponse.json({
      success: true,
      message: `Successfully updated ${updatedCount} products with new variants.`,
    });
  } catch (err) {
    console.error(err);
    await db.disconnectDb();
    return NextResponse.json(
      { success: false, message: err.message },
      { status: 500 }
    );
  }
}
