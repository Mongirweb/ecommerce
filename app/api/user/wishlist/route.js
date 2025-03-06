import User from "../../../../models/User";
import db from "../../../../utils/db";
import auth from "../../../../middleware/auth";

export async function PUT(req) {
  try {
    // Authenticate the user
    await auth(req); // This will throw an error if authentication fails

    // Parse the request body
    const { product_id, style } = await req.json(); // Use req.json() to parse the body

    // Connect to the database
    await db.connectDb();

    // Find the authenticated user
    const user = await User.findById(req.user);

    // Check if the product is already in the user's wishlist
    const exist = user.wishlist.find(
      (x) => x.product == product_id && x.style == style
    );
    if (exist) {
      await db.disconnectDb();
      return new Response(
        JSON.stringify({
          message: "Este producto ya existe en tu lista de deseos.",
        }),
        {
          status: 400,
        }
      );
    }

    // Add the product to the user's wishlist
    await user.updateOne({
      $push: {
        wishlist: {
          product: product_id,
          style,
        },
      },
    });

    // Disconnect from the database
    await db.disconnectDb();

    return new Response(
      JSON.stringify({ message: "Producto añadido a tu lista de deseos." }),
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ message: error.message }), {
      status: 500,
    });
  }
}
