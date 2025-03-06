import User from "../../../models/User";
import { authOptions } from "../../api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import ProfileClient from "./ProfileClient";
import db from "../../../utils/db";

export default async function MyProfile({ searchParams }) {
  const session = await getServerSession(authOptions);
  const tab = searchParams?.tab || 0;

  // (1) Connect to DB
  await db.connectDb();

  // (2) Find user in DB
  const userDb = await User.findById(session.user.id).lean();

  // (3) Extract the provider from the DB user
  const provider = userDb?.provider || "credentials";

  const hasPassword = session?.user?.password;

  // (4) Disconnect from DB if desired
  await db.disconnectDb();

  return (
    <ProfileClient
      tab={tab}
      session={session.user}
      provider={provider}
      hasPassword={hasPassword}
    />
  );
}
