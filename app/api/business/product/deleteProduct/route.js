import db from "../../../../../utils/db";
import Product from "../../../../../models/Product";
import auth from "../../../../../middleware/auth";
import { NextResponse } from "next/server";

export async function DELETE(req) {
  try {
    // 1. Auth & DB connection
    await auth(req);
    await db.connectDb();

    // 2. Parse request body
    //    You should send { productId: "parentProductId", subProductId: "theSubProductId" }
    const { productId, subProductId } = await req.json();

    // 3. Find the parent product
    const product = await Product.findById(productId);
    if (!product) {
      return NextResponse.json(
        { message: "Parent product not found." },
        { status: 404 }
      );
    }

    // 4. If there's only 1 sub-product and it matches the one we're removing,
    //    just delete the entire product.
    if (
      product.subProducts.length === 1 &&
      product.subProducts[0]._id.toString() === subProductId
    ) {
      await Product.findByIdAndDelete(productId);
      await db.disconnectDb();
      return NextResponse.json(
        { message: "Product deleted because there was only one sub-product." },
        { status: 200 }
      );
    }

    // 5. Otherwise, filter out the matching sub-product
    const originalLength = product.subProducts.length;
    product.subProducts = product.subProducts.filter(
      (sub) => sub._id.toString() !== subProductId
    );

    // If no sub-product was removed, it means the subProductId didn't match anything
    if (product.subProducts.length === originalLength) {
      await db.disconnectDb();
      return NextResponse.json(
        { message: "Sub-product not found in this product." },
        { status: 404 }
      );
    }

    // 6. Save the updated product
    await product.save();

    // 7. Disconnect & return success (optional disconnect depending on your setup)
    await db.disconnectDb();

    return NextResponse.json(
      {
        message: "Sub-product removed successfully",
        product,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
