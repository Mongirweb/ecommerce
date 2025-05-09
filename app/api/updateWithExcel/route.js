import { NextResponse } from "next/server";
import Product from "../../../models/Product";
import db from "../../../utils/db";
import mongoose from "mongoose";

// Helper function to remove white space and hidden characters,
// keeping only numeric characters.

export async function POST(request) {
  try {
    await db.connectDb();
    const extractedData = await request.json();

    // Build a lookup map for price updates: { [cleanedCodigoLargo]: numericPrice }
    const priceMap = extractedData.reduce((acc, row) => {
      // Clean the codigoLargo to remove extra white space and hidden characters.
      let codigoLargoClean = row.codigoLargo;
      // Remove the first character if it is '0'
      if (codigoLargoClean.startsWith("0")) {
        codigoLargoClean = codigoLargoClean.substring(1);
      }
      // Clean atributo1 (price) as before
      const atributo1Clean = row.atributo1;

      if (atributo1Clean !== "" && !isNaN(Number(atributo1Clean))) {
        acc[codigoLargoClean] = Number(atributo1Clean);
      } else {
        console.warn(`Skipping SKU ${codigoLargoClean}: invalid atributo1.`);
      }
      return acc;
    }, {});

    // Fetch all products for the given company
    const products = await Product.find({
      company: new mongoose.Types.ObjectId("67c897f20dc05232dfb724e9"),
    });

    let updatedProductsCount = 0;

    // For each product, iterate over subProducts and their sizes.
    for (const product of products) {
      let productUpdated = false;
      product.subProducts.forEach((subProd) => {
        subProd.sizes.forEach((sizeObj) => {
          // Clean the SKU from the product and remove the first 0 if present.
          let skuClean = sizeObj.sku;
          if (skuClean.startsWith("0")) {
            skuClean = skuClean.substring(1);
          }
          if (priceMap.hasOwnProperty(skuClean)) {
            sizeObj.wholesalePrice = priceMap[skuClean];
            sizeObj.price = priceMap[skuClean] * 1.2;
            sizeObj.priceWithDiscount = priceMap[skuClean] * 1.2;
            sizeObj.priceWithDiscountFlash = priceMap[skuClean] * 1.2;
            sizeObj.qty = 50;
            productUpdated = true;
          } else {
            console.warn(`No price found for SKU ${skuClean}.`);
            sizeObj.qty = 0;
          }
        });
      });
      if (productUpdated) {
        await product.save();
        updatedProductsCount++;
      }
    }

    await db.disconnectDb();

    return NextResponse.json({
      message: "Products updated successfully.",
      totalProducts: products.length,
      updatedProducts: updatedProductsCount,
    });
  } catch (error) {
    console.error("Error updating products:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
    });
  }
}
