// app/admin/dashboard/product/all/page.js
import ProductsClient from "./ProductsClient";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../api/auth/[...nextauth]/route";
import Layout from "../../../../../components/admin/layout";

export const metadata = {
  title: "Mongir - Mis Productos",
};

export default async function AllProductsPage() {
  const session = await getServerSession(authOptions); // Get user session
  const companyId = session.user.id;

  return (
    <Layout>
      <ProductsClient companyId={companyId} />
    </Layout>
  );
}
