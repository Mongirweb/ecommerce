// app/messenger/page.js (App Router)

import User from "../../models/User";
import Order from "../../models/Order";
import Product from "../../models/Product";
import { getServerSession } from "next-auth";

import db from "../../utils/db";
import MessengerClient from "./MessengerClient";
import { authOptions } from "../api/auth/[...nextauth]/route";

// Add this at the top of the file
export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata = {
  title: "Somos el Hueco Medellín - Mensajero",
};

export default async function MessengerPage() {
  const session = await getServerSession(authOptions); // Get user session

  if (!session) {
    redirect("/auth/signin");
  }

  // Connect to the database
  await db.connectDb();
  const messengerId = session.user.id;
  const user = await User.findById(messengerId).lean();

  // Fetch orders associated with the company or the messenger
  let orders = await Order.find({
    $or: [
      {
        isPaid: true,
        messengerStatus: {
          $in: ["En proceso de empacar", "Empacado"],
        },
        messengerId: messengerId,
      },
      {
        isPaid: true,
        messengerStatus: {
          $nin: ["Entregado a transportador", "Cancelado"],
        },
      },
    ],
  })
    .sort({ createdAt: 1 })
    .limit(1)
    .populate({ path: "user", model: User })
    .lean();

  // Disconnect from the database
  await db.disconnectDb();

  return (
    <div>
      <MessengerClient session={session} orders={orders} user={user} />
    </div>
  );
}
