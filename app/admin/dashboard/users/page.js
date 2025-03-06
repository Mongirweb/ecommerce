import Layout from "../../../../components/admin/layout";
import EnhancedTable from "../../../../components/admin/users/table";
import User from "../../../../models/User";
import db from "../../../../utils/db";
import UserPageClient from "./UserPageClient";

// Server Component
export default async function UsersPage() {
  await db.connectDb();
  const users = await User.find({}).sort({ createdAt: -1 }).lean();
  await db.disconnectDb();

  return <UserPageClient users={users} />;
}
