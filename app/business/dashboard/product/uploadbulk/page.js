// app/business/dashboard/product/create/page.js

import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../../../app/api/auth/[...nextauth]/route";
import UploadBulkClient from "./uploadBulkClient";
import Category from "../../../../../models/Category";
import SubCategory from "../../../../../models/SubCategory";
import SubCategory2 from "../../../../../models/SubCategory2";
import SubCategory3 from "../../../../../models/SubCategory3";

export const metadata = {
  title: "Mongir - Subir Productos",
};

export default async function CreateProductPage() {
  // Connect to the database

  // Fetch the session
  const session = await getServerSession(authOptions);
  const productsCategories = await Category.find().lean();
  const productsSubcategories = await SubCategory.find().lean();
  const productsSubcategories2 = await SubCategory2.find().lean();
  const productsSubcategories3 = await SubCategory3.find().lean();

  // Pass data to the client component
  return (
    <UploadBulkClient
      user={session?.user}
      productsCategories={productsCategories}
      productsSubcategories={productsSubcategories}
      productsSubcategories2={productsSubcategories2}
      productsSubcategories3={productsSubcategories3}
    />
  );
}
