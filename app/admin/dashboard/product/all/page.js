// app/admin/dashboard/product/all/page.js
import ProductsClient from "./ProductsClient";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../api/auth/[...nextauth]/route";
import Layout from "../../../../../components/admin/layout";
import db from "../../../../../utils/db";
import User from "../../../../../models/User";

export const metadata = {
  title: "Somos el Hueco Medellín - Mis Productos",
};

export default async function AllProductsPage() {
  await db.connectDb();
  const session = await getServerSession(authOptions); // Get user session
  const companyId = session.user.id;
  const companies = await User.find({ role: "business" }).lean();
  await db.disconnectDb();

  return (
    <Layout>
      <ProductsClient companyId={companyId} companies={companies} />
    </Layout>
  );
}
