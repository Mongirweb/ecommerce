import { NextResponse } from "next/server";
import Papa from "papaparse";
import db from "../../../utils/db";
import Product from "../../../models/Product";
import slugify from "slugify";

// Helper function to capitalize each word in a string
function capitalizeEachWord(str) {
  if (!str) return "";
  return str
    .split(/\s+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

// Helper function to parse price strings as numbers
function parsePrice(rawValue) {
  if (!rawValue) return 0;
  let val = rawValue
    .toString()
    .trim()
    .replace(/[^\d.,-]/g, "");
  val = val.replace(",", ".");
  let parsed = parseFloat(val);
  if (isNaN(parsed)) {
    parsed = 0;
  }
  return parsed;
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
    });

    // 5) Group rows by "SKU"
    const groupedBySKU = {};
    for (const row of rows) {
      const sku = (row.SKU || "").trim();
      ``;
      if (!sku) continue; // Skip if no SKU
      if (!groupedBySKU[sku]) {
        groupedBySKU[sku] = [];
      }
      groupedBySKU[sku].push(row);
    }

    // If no products found in CSV, throw an error
    const allSKUs = Object.keys(groupedBySKU);
    if (allSKUs.length === 0) {
      throw new Error("No products found in CSV (no valid SKU values).");
    }

    // 6) Loop over every SKU to build products
    let importedCount = 0;
    for (const [sku, rowGroup] of Object.entries(groupedBySKU)) {
      // a) Take the first row in this group as the "main" row
      const mainRow = rowGroup[0];

      // b) Basic product-level fields
      const rawName = mainRow["Nombre"] || "Untitled Product";
      const name = capitalizeEachWord(rawName);

      // Description (if you have a column for it, use that instead)
      const description = "";

      // brand from the CSV column "Marcas"
      const brand = mainRow["Marcas"] || "El Rio";

      // For now, we’ll use the SKU as the slug
      const slugOptions = {
        lower: true,
        strict: true,
        remove: /[*+~.()'"!:@,]/g,
      };
      const slug = slugify(mainRow["Nombre"], slugOptions);

      // (Optional) Hard-code category, subcategories, and company IDs
      // Adjust these to your real values or remove if not needed
      const artId = "672beb92269204da83f3eb34";
      const escuelaId = "672bebf9269204da83f3eb76";
      const oficinaId = "672bec0b269204da83f3eb82";
      const categoryId = "66b683a4c2bd5f4688ba3e5d";
      const subCategories = [{ _id: "672be40573a386d9e158d526" }];
      const companyId = "67dc2bf15c96ade19a5a310e";

      // c) Gather ALL images from this rowGroup using "Imágenes"
      const allUrls = rowGroup.flatMap((rowItem) => {
        // If there are multiple URLs in one cell, split by comma
        const rawImages = (rowItem["Imágenes"] || "").trim();
        if (!rawImages) return [];
        // Split on commas (allowing for optional whitespace around them)
        return rawImages.split(/\s*,\s*/).filter(Boolean);
      });
      const uniqueUrls = [...new Set(allUrls)];

      // If there are no images, skip this product
      if (uniqueUrls.length === 0) {
        console.log(`Skipping SKU: ${sku}, no images found.`);
        continue;
      }

      // Convert each URL into an object for your subProduct structure
      const imageObjects = uniqueUrls.map((imgUrl) => ({
        url: imgUrl,
        public_id: "",
      }));

      // d) Variant & subProduct information
      //    - Use "Precio normal" as your main variant price
      //    - Use "Precio al por Mayor" as your wholesale price if needed
      //    - Hard-code or parse a quantity if your CSV doesn’t have it
      // Parse numeric fields safely
      const variantPrice = parsePrice(mainRow["Precio normal"]);
      const wholesalePrice = parsePrice(mainRow["Precio al por Mayor"]);
      const variantQty = 50; // default to 10, or read from CSV if available
      const colorValue = "#ADD8E6"; // default or read from CSV if available
      const category = mainRow["Categorías"].split(">")[0] || "";
      let subCatId = ""; // We will fill this below

      switch (category) {
        case "Sin categorizar":
          subCatId = [{ _id: artId }];
          break;
        case "Escolar":
          subCatId = [{ _id: escuelaId }];
          break;
        case "Oficina":
          subCatId = [{ _id: oficinaId }];
          break;
        case "Arte":
          subCatId = [{ _id: artId }];
          break;
        default:
          // If none match, pick a default
          subCatId = [{ _id: artId }];
          break;
      }

      const subProducts = [
        {
          images: imageObjects,
          description_images: [],
          gender: "Sin género",
          warranty: { number: 1 },
          weight: "0.1",
          flashOffer: "No",
          chargeMarket: 0,
          measures: {
            long: "15",
            width: "10",
            high: "5",
            volumetric_weight: "",
          },
          color: {
            color: colorValue,
            // Optionally set the first image as the color image
            image: uniqueUrls[0] || "",
          },
          sizes: [
            {
              qty: variantQty,
              wholesalePrice,
              price: variantPrice,
              sku: sku, // re-using SKU here
              universalCode: sku,
              priceWithDiscount: variantPrice,
              priceWithDiscountFlash: variantPrice,
            },
          ],
          discount: 0,
          variant: "Default Variant",
          flashDiscount: 0,
          sold: 0,
          soldInFlash: 0,
          totalSold: 0,
        },
      ];

      // e) Upsert product in DB
      const product = await Product.findOneAndUpdate(
        { slug },
        {
          company: companyId,
          name,
          description,
          brand,
          slug,
          category: categoryId,
          subCategories: subCatId,
          subProducts,
        },
        { upsert: true, new: true }
      );

      importedCount++;
    }

    // 7) Close DB & return success
    await db.disconnectDb();

    return NextResponse.json({
      success: true,
      message: `Processed ${allSKUs.length} SKUs. Imported/updated ${importedCount} products successfully (skipped those missing images).`,
    });
  } catch (error) {
    await db.disconnectDb();
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
