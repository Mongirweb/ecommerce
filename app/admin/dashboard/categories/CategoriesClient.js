"use client";
import Create from "../../../../components/admin/categories/Create";
import List from "../../../../components/admin/categories/List";
import { useState } from "react";
import Layout from "../../../../components/admin/layout";

// Client component to handle interactive features
export default function CategoriesClient({ initialCategories }) {
  const [data, setData] = useState(initialCategories);

  return (
    <div>
      <Layout>
        <Create setCategories={setData} />
        <List categories={data} setCategories={setData} />
      </Layout>
    </div>
  );
}
