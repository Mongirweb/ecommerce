import db from "../../../utils/db";

import { NextResponse } from "next/server";
import Product from "../../../models/Product";
import client from "../../lib/elasticSearch";

export async function POST() {
  await db.connectDb();
  try {
    // Fetch all products with their subProducts
    const products = await Product.find().lean();

    // Prepare the bulk body for Elasticsearch
    const body = products.flatMap((product) =>
      product.subProducts.flatMap((subProduct) => {
        // Determine the main image
        const mainImage =
          subProduct.images?.find((img) => img.order === 1) ||
          subProduct.images?.[0];

        return [
          {
            index: { _index: "products", _id: subProduct._id.toString() },
          },
          {
            // Add necessary details
            productId: product._id.toString(),
            company: product.company.toString(),
            name: `${product.name} - ${subProduct.variant}`,
            slug: product.slug,
            category: product.category,
            subCategories: product.subCategories,
            warranty: subProduct?.warranty,
            flashOffer: subProduct?.flashOffer,
            flashDiscount: subProduct?.flashDiscount,
            discount: subProduct?.discount,
            price: subProduct?.price,
            priceWithDiscount: subProduct?.priceWithDiscount,
            priceWithDiscountFlash: subProduct?.priceWithDiscountFlash,
            measures: subProduct?.measures,
            sizes: subProduct?.sizes,
            gender: subProduct?.gender,
            image: mainImage?.url || "",
            createdAt: product?.createdAt,
            updatedAt: product?.updatedAt,
          },
        ];
      })
    );

    // Execute bulk indexing in Elasticsearch
    const bulkResponse = await client.bulk({ refresh: true, body });

    // Check for errors
    if (bulkResponse.errors) {
      console.error(
        "Elasticsearch bulk response errors:",
        bulkResponse.items.filter((item) => item.index && item.index.error)
      );
      return NextResponse.json(
        {
          message: "Failed to index products and subProducts",
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        message: "Products and subProducts indexed successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error indexing products:", error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  } finally {
    await db.disconnectDb();
  }
}
