// app/admin/subCategories/page.js (Server Component)

import SubCategory2 from "../../../../models/SubCategory2";
import SubCategory3 from "../../../../models/SubCategory3";
import db from "../../../../utils/db";

import SubCategoriesClient from "./SubCategoriesClient";

// Server Component
export default async function SubCategoriesPage() {
  await db.connectDb();
  const subCategory = await SubCategory2.find({})
    .sort({ updatedAt: -1 })
    .lean();
  const subCategories = await SubCategory3.find({})
    .populate({ path: "parent", model: SubCategory2 })
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
