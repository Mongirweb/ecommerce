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

    const { orderId, uploaded_image } = await req.json();

    if (!orderId || !uploaded_image) {
      throw new Error("Completar toda la información");
    }

    const user = await User.findById(req.user);
    user.deliveredOrders.push(orderId);
    await user.save();

    // 1) Parse the incoming JSON
    const order = await Order.findById(orderId);

    // Update the order status
    order.photoDelivered = {
      image: uploaded_image[0].url,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    order.messengerStatus = "Entregado a transportador";
    order.deliveryStatus = "Pendiente de envio";

    await order.save();

    await db.disconnectDb();
    return new Response(
      JSON.stringify({ message: "Entregado a transportador", order: order }),
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
