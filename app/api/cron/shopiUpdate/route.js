// Import necessary libraries
// Adjust the path as needed
import { NextResponse } from "next/server";
import { updateShopifyProducts } from "../../../../utils/shopifyUpdate";
import Product from "../../../../models/Product";
import db from "../../../../utils/db";

// API Route to update products
export async function GET(req, res) {
  try {
    await db.connectDb();
    const response = await updateShopifyProducts();

    if (!response?.products?.edges?.length) {
      return NextResponse.json({
        message: "No products returned from Shopify.",
      });
    }

    const edges = response.products.edges;
    let importedCount = 0;

    // Loop over each product from Shopify
    for (const { node: shopifyProduct } of edges) {
      const handle = shopifyProduct.handle;
      const slug = handle;
      const variantEdges = shopifyProduct.variants?.edges || [];

      // Skip if no variants
      if (!variantEdges.length) continue;

      // 1) Find existing product by slug/handle (case-insensitive)
      const existingProduct = await Product.findOne({
        slug: { $regex: new RegExp(`^${slug}$`, "i") },
      });
      // If the product doesn't exist, skip updating it
      if (!existingProduct) {
        continue;
      }

      // 2) Build new "subProducts" data from Shopify variants
      const shopifySubProducts = variantEdges.map(({ node: variant }) => {
        const id = variant.id.split("gid://shopify/ProductVariant/")[1];
        const variantSku = variant.sku || ""; // might be empty
        const variantQty = variant.quantityAvailable || 0;
        const variantPrice = variant.priceV2?.amount || "0";

        return {
          idShopify: id,
          sizes: [
            {
              qty: Number(variantQty),
              price: Number(variantPrice),
              sku: variantSku, // possibly empty
              // ... other size fields as needed
            },
          ],
        };
      });

      // 3) Merge the new Shopify subProducts into the existing subProducts
      for (const shopifySub of shopifySubProducts) {
        // Look for an existing subProduct with the same idShopify
        const index = existingProduct.subProducts.findIndex(
          (sp) => sp.idShopify === shopifySub.idShopify
        );

        if (index > -1) {
          // If found, overwrite the entire "sizes" array
          // so we don't lose images/color/etc.
          // const existingSizes = existingProduct.subProducts[index].sizes || [];
          // shopifySub.sizes.forEach((newSize) => {
          //   // Match sizes based on a unique key. Here we use sku as an example.
          //   const sizeIndex = existingSizes.findIndex(
          //     (s) => s.sku === newSize.sku
          //   );
          //   if (sizeIndex > -1) {
          //     // Update only the fields we want to change (qty and price)
          //     existingSizes[sizeIndex].qty = newSize.qty;
          //     existingSizes[sizeIndex].price = newSize.price;
          //     // Other fields (e.g., size, universalCode, priceWithDiscount) remain intact
          //   } else {
          //     // If the size doesn't exist, add it
          //     existingSizes.push(newSize);
          //   }
          // });
          existingProduct.subProducts[index].sizes[0].qty =
            shopifySub.sizes[0].qty;
          existingProduct.subProducts[index].sizes[0].price =
            shopifySub.sizes[0].price;
        } else {
          // If no matching subProduct is found, add a new one
          existingProduct.subProducts.push({
            ...shopifySub,
            // Provide default values for other properties so the new subProduct isn't empty
            images: [],
            color: {},
            warranty: {
              number: 1,
            },
            // You can add additional defaults as needed
          });
        }
      }

      // 4) Save the updated product document
      await existingProduct.save();
      importedCount++;
    }

    // 5) Disconnect from the DB and return success
    await db.disconnectDb();

    return NextResponse.json({
      success: true,
      message: `Fetched ${edges.length} product(s) from Shopify. Imported/updated ${importedCount} in DB.`,
    });
  } catch (error) {
    console.error("Error updating products:", error);
    return NextResponse.json(
      { message: "Internal Server Error", error: error.message },
      { status: 500 }
    );
  }
}
