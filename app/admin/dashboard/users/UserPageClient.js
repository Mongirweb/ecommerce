"use client";
import React from "react";
import Layout from "../../../../components/admin/layout";
import EnhancedTable from "../../../../components/admin/users/table";

export default function UserPageClient({ users }) {
  return (
    <Layout>
      <EnhancedTable rows={users} />
    </Layout>
  );
}
