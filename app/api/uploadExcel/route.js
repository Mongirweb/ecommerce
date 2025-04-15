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
    console.log(extractedData);

    // Build a lookup map for price updates: { [cleanedCodigoLargo]: numericPrice }

    // Fetch all products for the given company
    const products = await Product.find();

    let updatedProductsCount = 0;

    // For each product, iterate over subProducts and their sizes.
    for (const product of products) {
      let productUpdated = false;
      product.subProducts.forEach((subProd) => {
        subProd.sizes.forEach((sizeObj) => {
          // Clean the SKU from the product and remove the first 0 if present.
          let skuClean = sizeObj.sku;

          if (extractedData.hasOwnProperty(skuClean)) {
            sizeObj.wholesalePrice = extractedData[skuClean];
            sizeObj.price = extractedData[skuClean] * 1.2;
            sizeObj.priceWithDiscount = extractedData[skuClean] * 1.2;
            sizeObj.priceWithDiscountFlash = extractedData[skuClean] * 1.2;
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
