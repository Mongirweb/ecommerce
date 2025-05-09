// app/admin/dashboard/orders/page.js
import db from "../../../../utils/db";
import Order from "../../../../models/Order";
import User from "../../../../models/User";
import Layout from "../../../../components/admin/layout";
import PaymentsPage from "./PaymentsPage";

export const dynamic = "force-dynamic"; // siempre datos frescos

/* ---------- 1️⃣  Agrupamos todo en MongoDB ---------- */
async function getCompanyPayments() {
  await db.connectDb();

  return await Order.aggregate([
    { $match: { isPaid: true } }, // solo órdenes pagadas
    { $unwind: "$products" }, // 1 documento por producto
    {
      $group: {
        // suma qty × wholesalePrice
        _id: "$products.company",
        amount: {
          $sum: {
            $multiply: ["$products.qty", "$products.wholesalePrice"],
          },
        },
      },
    },
    {
      $lookup: {
        // trae el usuario-empresa
        from: "users",
        localField: "_id",
        foreignField: "_id",
        as: "company",
      },
    },
    { $unwind: "$company" },
    {
      $project: {
        // formatea la salida
        companyId: "$_id",
        name: "$company.businessName",
        email: "$company.email",
        amount: 1,
        _id: 0,
      },
    },
    { $sort: { amount: -1 } }, // opcional: mayor → menor
  ]);
}

/* ---------- 2️⃣  Página del dashboard ---------- */
export default async function OrdersPage() {
  const payments = await getCompanyPayments(); // [{companyId, name, amount}, …]

  return (
    <Layout>
      <PaymentsPage payments={payments} />
    </Layout>
  );
}
