import { NextResponse } from "next/server";
import db from "../../../../../utils/db";
import Product from "../../../../../models/Product";
import auth from "../../../../../middleware/auth";
import User from "../../../../../models/User";

export async function PUT(request, { params }) {
  try {
    // 1) Connect to the DB
    await db.connectDb();
    await auth(request); // This will attach `req.user`

    // 2) Authenticate user
    const user = await User.findById(request.user);
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // 3) Get product ID from the dynamic route
    const productId = params.id;

    // 4) Parse body from the request
    //    (Make sure you're calling request.json(), not req.json())
    const { size, style, fit, rating, review, images } = await request.json();

    // 5) Find the product by ID
    const product = await Product.findById(productId);
    if (!product) {
      return NextResponse.json(
        { message: "Product not found" },
        { status: 404 }
      );
    }

    // If your `auth` middleware returns just the user ID, 'user' is the user ID.
    // If it returns a user object, you'd do: user._id.toString() below.
    const userId = typeof user === "object" ? user._id.toString() : user;

    // 6) Check if the user has already left a review
    const exist = product.reviews.find((x) => x.reviewBy.toString() === userId);

    if (exist) {
      // 6a) If review exists, update the review
      await Product.updateOne(
        {
          _id: productId,
          "reviews._id": exist._id,
        },
        {
          $set: {
            "reviews.$.review": review,
            "reviews.$.rating": rating,
            "reviews.$.size": size,
            "reviews.$.fit": fit,
            "reviews.$.images": images,
            "reviews.$.style": style,
          },
        },
        {
          new: true,
        }
      );

      // 6b) Recalculate rating, etc.
      const updatedProduct = await Product.findById(productId);
      updatedProduct.numReviews = updatedProduct.reviews.length;
      updatedProduct.rating =
        updatedProduct.reviews.reduce((a, r) => r.rating + a, 0) /
        updatedProduct.reviews.length;

      await updatedProduct.save();
      await updatedProduct.populate("reviews.reviewBy");
      await db.disconnectDb();

      return NextResponse.json(
        {
          reviews: updatedProduct.reviews.reverse(),
        },
        { status: 200 }
      );
    } else {
      // 7) Otherwise, create a new review
      const newReview = {
        reviewBy: userId, // If user is an object, use user._id
        rating,
        review,
        size,
        fit,
        style,
        images,
      };

      product.reviews.push(newReview);
      product.numReviews = product.reviews.length;
      product.rating =
        product.reviews.reduce((a, r) => r.rating + a, 0) /
        product.reviews.length;

      await product.save();
      await product.populate("reviews.reviewBy");
      await db.disconnectDb();

      return NextResponse.json(
        {
          reviews: product.reviews.reverse(),
        },
        { status: 200 }
      );
    }
  } catch (error) {
    console.error("Error adding review:", error);
    // Ensure DB is disconnected in case of error
    await db.disconnectDb();
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
