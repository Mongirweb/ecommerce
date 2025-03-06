// app/components/admin/subCategories/SubCategoriesClient.js

"use client";

import { useState } from "react";
import Create from "../../../../components/admin/subCategories2/Create";
import List from "../../../../components/admin/subCategories/List";
import Layout from "../../../../components/admin/layout";

export default function SubCategoriesClient({ categories, subCategories }) {
  const [data, setData] = useState(subCategories);

  return (
    <div>
      <Layout>
        <Create setSubCategories={setData} categories={categories} />
        <List
          categories={categories}
          subCategories={data}
          setSubCategories={setData}
        />
      </Layout>
    </div>
  );
}
