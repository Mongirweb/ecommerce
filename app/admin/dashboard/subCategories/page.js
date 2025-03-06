// app/admin/subCategories/page.js (Server Component)

import db from "../../../../utils/db";
import Category from "../../../../models/Category";
import SubCategory from "../../../../models/SubCategory";
import SubCategoriesClient from "./SubCategoriesClient";

// Server Component
export default async function SubCategoriesPage() {
  await db.connectDb();
  const categories = await Category.find({}).sort({ updatedAt: -1 }).lean();
  const subCategories = await SubCategory.find({})
    .populate({ path: "parent", model: Category })
    .sort({ updatedAt: -1 })
    .lean();

  return (
    <div>
      <SubCategoriesClient
        categories={JSON.parse(JSON.stringify(categories))}
        subCategories={JSON.parse(JSON.stringify(subCategories))}
      />
    </div>
  );
}
