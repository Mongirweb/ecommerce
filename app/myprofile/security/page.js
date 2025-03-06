import { getServerSession } from "next-auth";
import { authOptions } from "../../../app/api/auth/[...nextauth]/route";
import SecurityClient from "./SecurityClient";

export default async function Addresses({ searchParams }) {
  const session = await getServerSession(authOptions);
  const tab = searchParams?.tab || 0;

  return (
    <SecurityClient
      user={session.user}
      tab={tab}
      hasPassword={session.user.password}
    />
  );
}
