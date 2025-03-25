// app/admin/dashboard/page.js (App Router)

import User from "../../../models/User";
import Order from "../../../models/Order";
import Product from "../../../models/Product";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../app/api/auth/[...nextauth]/route";
import DashBoardPage from "./DashBoardPage";
import db from "../../../utils/db";

export const metadata = {
  title: "Mongir - Business Dashboard",
};

export default async function Dashboard() {
  const session = await getServerSession(authOptions); // Get user session
  if (!session) {
    redirect("/auth/signin");
  }

  const companyId = session.user.id;

  // Connect to the database
  await db.connectDb();

  // Fetch orders associated with the company
  let orders = await Order.find({ isPaid: true, "products.company": companyId })
    .sort({ createdAt: -1 })
    .populate({ path: "user", model: User })
    .lean();

  // Modify each order to include only products related to the company
  orders = orders.map((order) => {
    const filteredProducts = order.products.filter(
      (product) => product.company.toString() === companyId.toString()
    );
    // Calculate the total for the filtered products
    const total = filteredProducts.reduce((sum, product) => {
      return sum + product.qty * product.wholesalePrice;
    }, 0);

    return {
      ...order,
      products: filteredProducts, // Replace products with the filtered ones
      total,
    };
  });

  // Fetch all products created by the company
  const products = await Product.find({ company: companyId }).lean();

  // Disconnect from the database
  await db.disconnectDb();

  return (
    <div>
      <DashBoardPage session={session} orders={orders} products={products} />
    </div>
  );
}
