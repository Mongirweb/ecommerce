// app/admin/dashboard/page.js (App Router)

import User from "../../../models/User";
import Order from "../../../models/Order";
import Product from "../../../models/Product";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../app/api/auth/[...nextauth]/route";
import DashBoardPage from "./DashBoardPage";
import db from "../../../utils/db";

export const metadata = {
  title: "Somos el Hueco Medellín - Admin Dashboard",
};

export default async function Dashboard() {
  const session = await getServerSession(authOptions); // Get user session
  // Fetch data from your database
  await db.connectDb();
  const orders = await Order.find()
    .populate({ path: "user", model: User })
    .lean();
  const products = await Product.find().lean();
  await db.disconnectDb();

  return (
    <div>
      <DashBoardPage session={session} orders={orders} products={products} />
    </div>
  );
}
