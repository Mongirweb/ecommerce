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

    const { orderId, uploaded_image, packageCount } = await req.json();

    if (!orderId || !uploaded_image || !packageCount) {
      throw new Error("Completar toda la información");
    }

    // 1) Parse the incoming JSON
    const order = await Order.findById(orderId);

    // Update the order status
    order.inBagProductsInfos = {
      image: uploaded_image[0].url,
      productsQty: packageCount,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    order.messengerStatus = "Empacado";

    await order.save();

    await db.disconnectDb();
    return new Response(
      JSON.stringify({ message: "Productos empacados.", order: order }),
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
