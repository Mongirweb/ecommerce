// app/admin/dashboard/orders/page.js
import db from "../../../../utils/db";
import Order from "../../../../models/Order";
import User from "../../../../models/User";
import Layout from "../../../../components/business/layout";
import CollapsibleTable from "../../../../components/business/orders/table";

export const dynamic = "force-dynamic"; // Use this to ensure dynamic rendering

// Fetch orders data on the server side
async function getData() {
  await db.connectDb();
  const orders = await Order.find({})
    .populate({ path: "user", model: User, select: "name email image" })
    .sort({ createdAt: 1 })
    .lean();
  return JSON.parse(JSON.stringify(orders)); // Return formatted orders data
}

export default async function OrdersPage() {
  const orders = await getData(); // Fetch the orders data

  return (
    <Layout>
      <CollapsibleTable rows={orders} />
    </Layout>
  );
}
