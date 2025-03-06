// File: app/order/[id]/page.jsx

import Order from "../../../models/Order";
import User from "../../../models/User";
import db from "../../../utils/db";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "../../api/auth/[...nextauth]/route"; // Adjust the path as needed
import OrderBusinessPage from "./OrderBusinessPage";

export const metadata = {
  title: "Somos el Hueco Medellín | Orden",
};

export default async function OrderPageWrapper({ params }) {
  // Authenticate the user
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/signin");
  }

  const { id } = params;
  await db.connectDb();

  const order = await Order.findById(id)
    .populate({ path: "user", model: User })
    .lean();

  await db.disconnectDb();

  if (!order) {
    redirect("/");
  }

  const paypal_client_id = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;

  const orderData = JSON.parse(JSON.stringify(order));

  return (
    <OrderBusinessPage
      orderData={orderData}
      paypal_client_id={paypal_client_id}
    />
  );
}
