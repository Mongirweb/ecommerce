// app/business/dashboard/product/all/page.js

import db from "../../../../../utils/db";
import Product from "../../../../../models/Product";
import Category from "../../../../../models/Category";
import Layout from "../../../../../components/business/layout";
import ProductsClient from "./ProductsClient";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../api/auth/[...nextauth]/route";

export const metadata = {
  title: "Somos el Hueco Medellín - Mis Productos",
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
