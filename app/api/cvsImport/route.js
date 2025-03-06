import { NextResponse } from "next/server";
import Papa from "papaparse";
import db from "../../../utils/db";
import Product from "../../../models/Product";

// Helper function to capitalize each word in a string
function capitalizeEachWord(str) {
  if (!str) return "";
  return str
    .split(/\s+/) // split on spaces (handles multiple spaces)
    .map((word) => {
      // Uppercase first letter, lowercase the rest
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join(" ");
}

export async function POST(request) {
  // 1) Read the uploaded file
  const formData = await request.formData();
  const file = formData.get("file"); // <input type="file" name="file"/>
  const csvText = await file.text();

  try {
    // 2) Connect DB
    await db.connectDb();

    // 3) Parse CSV with Papa
    const { data: rows } = Papa.parse(csvText, {
      header: true,
      skipEmptyLines: true,
    });

    // 4) Group by handle
    const groupedByHandle = {};
    for (const row of rows) {
      const handle = (row.Handle || "").trim();
      if (!groupedByHandle[handle]) {
        groupedByHandle[handle] = [];
      }
      groupedByHandle[handle].push(row);
    }

    // If no products found in CSV, throw an error
    const allHandles = Object.keys(groupedByHandle);
    if (allHandles.length === 0) {
      throw new Error("No products found in CSV.");
    }

    // 5) Loop over every handle to build products
    let importedCount = 0;
    for (const [handle, rowGroup] of Object.entries(groupedByHandle)) {
      // a) Pick the "main" row (often the first row with Title, Price, etc.)
      const mainRow = rowGroup.find((r) => r.Title) || rowGroup[0];

      //  --  Check the "Status" field in CSV (skip if not "active") --
      const csvStatus = (mainRow["Status"] || "").trim().toLowerCase();
      if (csvStatus !== "active") {
        // Skip creating this product
        continue;
      }

      // b) Basic product-level fields
      const rawTitle = mainRow.Title || "Untitled Product";
      const name = capitalizeEachWord(rawTitle); // Capitalize each word
      const description = mainRow["Body (HTML)"] || "";
      const brand = mainRow.Vendor || "";
      const slug = handle;

      const categoryId = "66b683bfc2bd5f4688ba3e6c"; // Example category
      const subCategories = [{ _id: "672be40573a386d9e158d526" }];
      const subCategorie2 = [{ _id: "672e55e110b35e38d4833766" }];
      const subCategorie3 = [{ _id: "672e8539088be824a9c4b480" }];
      const companyId = "67afdadf9acbabff66d36490"; // Example company

      // c) Gather ALL images from this rowGroup
      const allUrls = rowGroup
        .map((r) => r["Image Src"]?.trim())
        .filter(Boolean);
      const uniqueUrls = [...new Set(allUrls)];

      //  --  If there are no images, skip this product  --
      if (uniqueUrls.length === 0) {
        // Skip creating this product
        continue;
      }

      // Convert each URL into { url, public_id }
      const imageObjects = uniqueUrls.map((imgUrl) => ({
        url: imgUrl,
        public_id: "",
      }));

      // d) Single subProduct (If multiple variants, expand logic)
      const variantSku = mainRow["Variant SKU"] || "";
      const variantPrice = mainRow["Variant Price"] || "0";
      const variantQty = mainRow["Variant Inventory Qty"] || "0";

      // If you have a color column in CSV, use it; else default
      const colorValue =
        mainRow["Color (product.metafields.shopify.color-pattern)"] ||
        "#ADD8E6";

      const subProducts = [
        {
          images: imageObjects,
          description_images: [],
          gender: "Sin género",
          warranty: { number: 6 },
          weight: "0",
          flashOffer: "No",
          chargeMarket: 0,
          measures: {
            long: "",
            width: "",
            high: "",
            volumetric_weight: "",
          },
          color: {
            color: colorValue,
            // Optionally set the first image as color image
            image: uniqueUrls[0] || "",
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
          variant: mainRow["Option1 Value"] || "Default Variant",
          flashDiscount: 0,
          sold: 0,
          soldInFlash: 0,
          totalSold: 0,
        },
      ];

      // e) Upsert product in DB
      await Product.findOneAndUpdate(
        { slug },
        {
          company: companyId,
          name,
          description,
          brand,
          slug,
          category: categoryId,
          subCategories,
          subCategorie2,
          subCategorie3,
          subProducts,
        },
        { upsert: true, new: true }
      );

      importedCount++;
    }

    // 6) Close DB & return success
    await db.disconnectDb();

    return NextResponse.json({
      success: true,
      message: `Processed ${allHandles.length} product handles. Imported ${importedCount} products successfully (skipped non-active or missing-image).`,
    });
  } catch (error) {
    await db.disconnectDb();
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
