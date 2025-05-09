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

    const { orderId } = await req.json();

    // Find the user by their ID
    const user = await User.findById(req.user);

    // 1) Parse the incoming JSON
    const order = await Order.findById(orderId);

    if (order.messengerStatus === "Sin empacar") {
      // Update the order status
      order.messengerStatus = "En proceso de empacar";
      order.messengerId = req.user;
    }

    await order.save();

    await db.disconnectDb();
    return new Response(
      JSON.stringify({ message: "Order updated successfully." }),
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
