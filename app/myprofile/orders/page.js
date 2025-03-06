// app/profile/orders/page.js
import { getServerSession } from "next-auth";
// Ensure auth options are set up here
import OrdersClient from "./OrderClient";
import Order from "../../../models/Order";
import { ordersLinks } from "../../../data/profile";
import { authOptions } from "../../api/auth/[...nextauth]/route";

export default async function OrdersPage({ searchParams }) {
  const session = await getServerSession(authOptions);
  const tab = searchParams?.tab || 0;
  const filter = searchParams?.q?.split("__")[1];
  let orders = [];

  if (session) {
    const userId = session.user.id;
    if (!filter) {
      orders = await Order.find({ user: userId, isPaid: "true" })
        .sort({ createdAt: -1 })
        .lean();
    } else if (filter === "paid") {
      orders = await Order.find({ user: userId, isPaid: true })
        .sort({ createdAt: -1 })
        .lean();
    } else if (filter === "unpaid") {
      orders = await Order.find({ user: userId, isPaid: false })
        .sort({ createdAt: -1 })
        .lean();
    } else {
      orders = await Order.find({ user: userId, status: filter })
        .sort({ createdAt: -1 })
        .lean();
    }
  }

  return (
    <OrdersClient
      session={session.user}
      tab={tab}
      orders={JSON.parse(JSON.stringify(orders))}
      ordersLinks={ordersLinks}
    />
  );
}
