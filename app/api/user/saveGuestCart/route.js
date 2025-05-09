// File: app/api/cart/route.js

import { NextResponse } from "next/server";
import Product from "../../../../models/Product";
import GuestCart from "../../../../models/GuestCart";
import db from "../../../../utils/db";
import { v4 as uuid } from "uuid";

export async function POST(req) {
  try {
    // Connect to the database
    await db.connectDb();

    const { cart, token: incomingToken } = await req.json();

    // if there's no incomingToken (undefined/null/empty), generate one
    const token = incomingToken || uuid();

    // Process the products in the cart
    const products = await Promise.all(
      cart.map(async (cartItem) => {
        const dbProduct = await Product.findById(cartItem._id).lean();

        const subProduct = dbProduct.subProducts[cartItem.style];

        const price = Number(
          subProduct.sizes.find((p) => p.size === cartItem.size).price
        );

        let wholesalePrice = subProduct.sizes.find(
          (p) => p.size === cartItem.size
        ).wholesalePrice;

        const sku = subProduct.sizes.find((p) => p.size === cartItem.size).sku;
        const discountPrice =
          subProduct.discount > 0
            ? (price - (price * Number(subProduct.discount)) / 100).toFixed(2)
            : price.toFixed(2);

        return {
          discount: Number(subProduct.discount),
          originalPrice: price.toFixed(2).toString(),
          name: dbProduct.name,
          product: dbProduct._id,
          subProduct: subProduct._id,
          color: {
            color: cartItem.color.color,
            image: cartItem.color.image,
          },
          image: subProduct.images[0].url,
          qty: Number(cartItem.qty),
          size: cartItem.size,
          style: cartItem.style,
          price: parseFloat(discountPrice),
          wholesalePrice: parseFloat(wholesalePrice) || 0,
          company: dbProduct.company,
          companyName: cartItem.companyName || null,
          sku: sku,
          uid: cartItem._uid,
          fromShopify: dbProduct.fromShopify,
          idShopify: subProduct.idShopify,
          variant: subProduct.variant,
          weight: subProduct.weight,
          measures: subProduct.measures,
        };
      })
    );

    // Calculate cart total
    const cartTotal = products
      .reduce((total, product) => total + product.price * product.qty, 0)
      .toFixed(2);

    // Calculate cart total
    const wholeSaleTotal = products
      .reduce(
        (total, product) => total + product.wholesalePrice * product.qty,
        0
      )
      .toFixed(2);

    // Save the updated cart
    await GuestCart.findOneAndUpdate(
      { token },
      { products, cartTotal, wholeSaleTotal },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    // Disconnect from the database
    await db.disconnectDb();

    // always return the token you actually used
    return NextResponse.json(
      { message: "Cart updated successfully", token },
      { status: 200 }
    );
  } catch (error) {
    // Disconnect from the database in case of error
    await db.disconnectDb();

    // Return error response
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
