// app/business/dashboard/product/create/page.js

import db from "../../../../../utils/db";
import Product from "../../../../../models/Product";
import Category from "../../../../../models/Category";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../../../app/api/auth/[...nextauth]/route";
import CreateProductClient from "./CreateProductClient";

export const metadata = {
  title: "Somos el Hueco Medellín - Crear Producto",
};

export default async function CreateProductPage() {
  // Connect to the database
  await db.connectDb();

  // Fetch the session
  const session = await getServerSession(authOptions);
  const companyProducts = session?.user?.id;
  // Fetch parents (existing products) and categories
  const results = await Product.find({
    company: companyProducts,
  })
    .select("name subProducts")
    .lean();
  const categories = await Category.find().lean();

  await db.disconnectDb();

  // Pass data to the client component
  return (
    <CreateProductClient
      user={session?.user}
      parents={JSON.parse(JSON.stringify(results))}
      categories={JSON.parse(JSON.stringify(categories))}
    />
  );
}
