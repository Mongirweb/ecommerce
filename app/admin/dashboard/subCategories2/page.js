// app/admin/subCategories/page.js (Server Component)

import SubCategory from "../../../../models/SubCategory";
import SubCategory2 from "../../../../models/SubCategory2";
import db from "../../../../utils/db";

import SubCategoriesClient from "./SubCategoriesClient";

// Server Component
export default async function SubCategoriesPage() {
  await db.connectDb();
  const subCategory = await SubCategory.find({}).sort({ updatedAt: -1 }).lean();
  const subCategories = await SubCategory2.find({})
    .populate({ path: "parent", model: SubCategory })
    .sort({ updatedAt: -1 })
    .lean();

  return (
    <div>
      <SubCategoriesClient
        categories={JSON.parse(JSON.stringify(subCategory))}
        subCategories={JSON.parse(JSON.stringify(subCategories))}
      />
    </div>
  );
}
