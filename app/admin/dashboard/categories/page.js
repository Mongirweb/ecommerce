import Layout from "../../../../components/admin/layout";
import db from "../../../../utils/db";
import Category from "../../../../models/Category";
import Create from "../../../../components/admin/categories/Create";
import List from "../../../../components/admin/categories/List";
import CategoriesClient from "./CategoriesClient";

// Fetch categories directly in the server component
export default async function CategoriesPage() {
  // Connect to the database and fetch categories
  await db.connectDb();
  const categories = await Category.find({}).sort({ updatedAt: -1 }).lean();
  const initialCategories = JSON.parse(JSON.stringify(categories));

  // Initialize the state in a client component for interactivity
  return (
    <Layout>
      <CategoriesClient initialCategories={initialCategories} />
    </Layout>
  );
}
