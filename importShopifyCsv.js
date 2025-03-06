// importShopifyCsv.js
import fs from "fs";
import Papa from "papaparse";
import db from "./utils/db.js"; // your DB connection utility
import Product from "./models/Product.js"; // your product schema

async function importShopifyCsv() {
  try {
    // 1) Connect to Mongo
    await db.connectDb();

    // 2) Read CSV file from disk (adjust path accordingly)
    const file = fs.readFileSync("products.csv", "utf8");

    // 3) Parse CSV
    const parsed = Papa.parse(file, {
      header: true, // Tells Papa to treat the first row as headers
      skipEmptyLines: true,
    });

    // `parsed.data` is now an array of objects where keys are the CSV headers
    const rows = parsed.data;

    // 4) Group by "Handle" if your CSV has multiple variants for the same product
    //    We'll create a map: { handle: [row1, row2, ...], ... }
    const groupedByHandle = {};
    for (const row of rows) {
      const handle = row.Handle.trim();
      if (!groupedByHandle[handle]) {
        groupedByHandle[handle] = [];
      }
      groupedByHandle[handle].push(row);
    }

    // 5) For each handle group, build the product doc
    for (const [handle, rowGroup] of Object.entries(groupedByHandle)) {
      // The "main" row might be the first one
      const mainRow = rowGroup[0];

      // Basic mapping (adapt to your CSV columns):
      const name = mainRow.Title || "Untitled Product";
      const description = mainRow["Body (HTML)"] || "";
      const brand = mainRow.Vendor || ""; // Shopify's Vendor
      const slug = handle; // Typically the "Handle" is the slug

      // Hardcode or derive a category if your CSV doesn’t supply it:
      // e.g., store everything under a default category
      const categoryId = "64e6322b9a946543ad5f3896"; // Example category _id

      // subProducts = each variant (one row per variant)
      const subProducts = rowGroup.map((variantRow) => {
        const variantSku = variantRow["Variant SKU"] || "";
        const variantPrice = variantRow["Variant Price"] || "0";
        const variantQty = variantRow["Variant Inventory Qty"] || "0";

        return {
          sku: variantSku,
          universalCode: variantSku,
          // If you have multiple images in CSV, you'd parse them. By default Shopify CSV might just have an "Image Src".
          images: variantRow["Image Src"] ? [variantRow["Image Src"]] : [],
          sizes: [
            {
              size: variantRow["Option1 Value"] || "OneSize",
              qty: Number(variantQty),
              price: Number(variantPrice),
              sku: variantSku,
              universalCode: variantSku,
            },
          ],
        };
      });

      // Upsert into DB (so if you run this multiple times, it won’t duplicate)
      await Product.findOneAndUpdate(
        { slug }, // match on slug/handle
        {
          company: "64e6322b9a946543ad5f3811", // Some default user/company _id
          name,
          description,
          brand,
          slug,
          category: categoryId,
          subProducts,
        },
        { upsert: true, new: true }
      );
    }

    console.log("CSV import completed!");
    await db.disconnectDb();
  } catch (err) {
    console.error("Error importing CSV:", err);
  }
}

// Run the script if called directly
importShopifyCsv();
