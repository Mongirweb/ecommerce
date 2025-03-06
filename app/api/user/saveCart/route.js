// File: app/api/cart/route.js

import { NextResponse } from "next/server";
import Product from "../../../../models/Product";
import User from "../../../../models/User";
import Cart from "../../../../models/Cart";
import db from "../../../../utils/db";
import auth from "../../../../middleware/auth"; // Custom middleware

export async function POST(req) {
  try {
    // Connect to the database
    await db.connectDb();

    // Authenticate the user and attach it to req
    await auth(req); // This will attach `req.user`

    // Ensure the user is authenticated
    if (!req.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Parse the request body
    const { cart } = await req.json();

    // Find the user by their ID
    const user = await User.findById(req.user);

    // Find the user's existing cart and replace it if necessary
    let existing_cart = await Cart.findOne({ user: user._id });

    if (existing_cart) {
      await Cart.deleteOne({ _id: existing_cart._id });
    }

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
    await new Cart({
      products,
      cartTotal,
      user: user._id,
      wholeSaleTotal,
    }).save();

    // Disconnect from the database
    await db.disconnectDb();

    // Return success response
    return NextResponse.json(
      { message: "Cart updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    // Disconnect from the database in case of error
    await db.disconnectDb();

    // Return error response
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
