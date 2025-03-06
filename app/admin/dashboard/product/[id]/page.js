// app/admin/dashboard/product/[id]/page.js
import db from "../../../../../utils/db";
import Product from "../../../../../models/Product";
import Category from "../../../../../models/Category";
import SubCategory from "../../../../../models/SubCategory";
import SubCategory2 from "../../../../../models/SubCategory2";
import SubCategory3 from "../../../../../models/SubCategory3";
import EditProductClient from "./EditProductClient";
import { redirect } from "next/navigation";
import { authOptions } from "../../../../../app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";

export const metadata = {
  title: "Somos el Hueco Medellín - Editar Producto",
};

export default async function EditProductPage({ params, searchParams }) {
  const { id } = params;
  const index = searchParams.index || 0; // Default to 0 if index is not provided

  // Fetch the session to get the current user
  const session = await getServerSession(authOptions);

  // If the user is not logged in, redirect to the login page
  if (!session) {
    redirect("/auth/signin");
  }

  // Connect to the database and fetch the product
  await db.connectDb();
  const product = await Product.findOne({ _id: id })
  .lean();

  // Check if the product exists
  if (!product) {
    // Handle product not found, redirect or show an error
    redirect("/404");
  }

  const categories = await Category.find().lean();
  await db.disconnectDb();

  return (
    <EditProductClient
      product={JSON.parse(JSON.stringify(product))}
      categories={JSON.parse(JSON.stringify(categories))}
      index={index}
    />
  );
}
