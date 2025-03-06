import db from "../../../../../utils/db";
import Product from "../../../../../models/Product";
import Category from "../../../../../models/Category";
import CreateProductClient from "./CreateProductClient";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../../../app/api/auth/[...nextauth]/route";

// Server Component
export default async function CreateProductPage() {
  await db.connectDb();
  const products = await Product.find().select("name subProducts").lean();
  const categories = await Category.find().lean();
  // Fetch the session
  const session = await getServerSession(authOptions);
  await db.disconnectDb();

  return (
    <CreateProductClient
      user={session?.user}
      parents={JSON.parse(JSON.stringify(products))}
      categories={JSON.parse(JSON.stringify(categories))}
    />
  );
}
