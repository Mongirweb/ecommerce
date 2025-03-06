import db from "../../../../utils/db";
import Order from "../../../../models/Order";
import auth from "../../../../middleware/auth";
import User from "../../../../models/User";
import messenger from "../../../../middleware/messenger";
async function middleware(req) {
  await auth(req);
  await messenger(req);
}

export async function POST(req) {
  try {
    await db.connectDb();
    await middleware(req);

    const { orderId, productIndex } = await req.json();

    // 1) Find the order
    const order = await Order.findById(orderId);
    if (!order) {
      throw new Error("Order not found");
    }

    // 2) Get the specific product by index
    const product = order.products[productIndex];
    if (!product) {
      throw new Error("Product not found");
    }

    // 3) Mark the product as picked up
    product.pickedUp = true;
    product.pickedUpAt = new Date();

    // // 4) Check if all products are picked up
    // const allProductsPickedUp = order.products.every((p) => p.pickedUp);
    // if (allProductsPickedUp) {
    //   order.messengerStatus = "Empacado";
    // }

    // 5) Save the updated order
    await order.save();

    await db.disconnectDb();
    return new Response(
      JSON.stringify({
        message: "Product marked as collected successfully.",
        order: order,
      }),
      { status: 200 }
    );
  } catch (error) {
    // In case of an error, ensure DB is disconnected
    await db.disconnectDb();
    return new Response(JSON.stringify({ message: error.message }), {
      status: 500,
    });
  }
}
