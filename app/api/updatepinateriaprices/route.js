import { NextResponse } from "next/server";
import * as XLSX from "xlsx";
import db from "../../../utils/db";
import Product from "../../../models/Product";

export async function POST(request) {
  try {
    // 1) Connect to DB
    await db.connectDb();

    // 2) Parse the incoming form-data and extract the file
    const formData = await request.formData();
    const file = formData.get("file");

    if (!file) {
      throw new Error("No file uploaded.");
    }
    if (!(file instanceof Blob)) {
      throw new Error("Uploaded file is not valid.");
    }

    // 3) Convert the uploaded file (Blob) to an ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();

    // 4) Parse the Excel file from the ArrayBuffer
    const workbook = XLSX.read(arrayBuffer, { type: "array" });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const rows = XLSX.utils.sheet_to_json(worksheet, { defval: "" });
    if (!rows.length) {
      throw new Error("No rows found in Excel sheet.");
    }

    let updatedCount = 0;

    // 5) Loop over each row and update the wholesalePrice based on "PRECIO POR MAYOR"
    for (const row of rows) {
      // Clean up the row's keys by trimming any extra spaces
      const cleanRow = Object.keys(row).reduce((acc, key) => {
        acc[key.trim()] = row[key];
        return acc;
      }, {});

      // Extract data from the cleaned row
      let plu = cleanRow.plu;
      const newWholesalePrice = Number(cleanRow["PRECIO POR MAYOR"]);
      console.log("newWholesalePrice", newWholesalePrice);
      const { nombre } = cleanRow;
      plu = String(plu).trim();
      if (plu.startsWith("7")) {
        plu = "0" + plu;
      }

      // Skip rows with missing essential data
      if (!plu || !newWholesalePrice) {
        continue;
      }

      // Find the product by matching subProducts.sizes.sku and the company ID
      const product = await Product.findOne({
        "subProducts.sizes.sku": plu,
        company: "67ea9446ebaed641fde606fc",
      });

      if (!product) {
        console.log(`No product found for PLU: ${plu}`);
        continue;
      }

      // Update the wholesalePrice for the matching SKU
      let wasUpdated = false;
      for (const sub of product.subProducts) {
        for (const size of sub.sizes) {
          console.log("size.sku", size.sku);
          if (size.sku === plu) {
            size.wholesalePrice = newWholesalePrice;
            wasUpdated = true;
          }
        }
      }

      // If description is missing or empty, set a default description to pass validation.
      if (!product.description || product.description.trim() === "") {
        product.description = nombre;
      }

      // Save product only if an update occurred
      if (wasUpdated) {
        await product.save();
        updatedCount++;
      }
    }

    // 6) Disconnect and return the response
    await db.disconnectDb();
    return NextResponse.json({
      success: true,
      message: `Processed ${rows.length} row(s). Updated wholesalePrice for ${updatedCount} product(s).`,
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
