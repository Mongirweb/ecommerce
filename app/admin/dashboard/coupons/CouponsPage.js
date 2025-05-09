"use client";
import Layout from "../../../../components/admin/layout";
import { useState } from "react";
import Create from "../../../../components/admin/coupons/Create";
import List from "../../../../components/admin/coupons/List";

export default function CouponsPage({ coupons }) {
  const [data, setData] = useState(coupons);

  return (
    <Layout>
      <div>
        <Create setCoupons={setData} />
        <List coupons={data} setCoupons={setData} />
      </div>
    </Layout>
  );
}
