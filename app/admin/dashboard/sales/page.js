// app/business/sales/page.js

import React from "react";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../api/auth/[...nextauth]/route";
import db from "../../../../utils/db";
import Order from "../../../../models/Order";
import SalesPage from "./SalesPage"; // The client component we’ll create below
import PaymentRequest from "../../../../models/PaymentRequest";

export const metadata = {
  title: "Somos el Hueco Medellín - Admin Ventas",
};

export default async function Sales() {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/auth/signin");
  }

  // 1) Connect to DB
  await db.connectDb();

  // 2) Fetch all *paid* orders for this company
  const orders = await Order.find({
    isPaid: true,
  })
    .sort({ createdAt: -1 })
    .lean();

  // 3) For demonstration, let’s build monthly totals from these orders
  //    (Assuming each order has a `createdAt` date and total)
  const monthlySalesData = {};
  orders.forEach((order) => {
    // Filter this order’s products for current company
    const orderTotal = order.products.reduce(
      (sum, p) => sum + p.qty * p.price,
      0
    );

    // Extract month-year from createdAt
    const date = new Date(order.createdAt);
    const monthYear = `${date.getMonth() + 1}/${date.getFullYear()}`; // e.g. "7/2025"

    if (!monthlySalesData[monthYear]) {
      monthlySalesData[monthYear] = 0;
    }
    monthlySalesData[monthYear] += orderTotal;
  });

  // 4) Convert to array so Recharts can consume it easily
  const chartData = Object.entries(monthlySalesData).map(
    ([monthYear, total]) => ({
      monthYear,
      total,
    })
  );

  const totalSales = chartData.reduce((sum, { total }) => sum + total, 0);

  // Or “amount available” might be total monthly sales minus all “pending” or “paid out” amounts, etc.
  // This depends on your business logic. For now, let's just show a placeholder:

  await db.disconnectDb();

  return <SalesPage chartData={chartData} totalSales={totalSales} />;
}
