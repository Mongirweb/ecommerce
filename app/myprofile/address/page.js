import User from "../../../models/User";
import { authOptions } from "../../api/auth/[...nextauth]/route";
import AddressClient from "./AddressClient";
import { getServerSession } from "next-auth";

export default async function Addresses({ searchParams }) {
  const session = await getServerSession(authOptions);
  const tab = searchParams?.tab || 0;
  const address = await User.findById(session.user.id).select("address").lean();

  return <AddressClient tab={tab} session={session.user} address={address} />;
}
