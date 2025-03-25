import { authOptions } from "../api/auth/[...nextauth]/route";
import Layout from "../../components/profile/layout";
import { getServerSession } from "next-auth";

export const metadata = {
  title: "Mongir - Mi perfil",
};

export default async function Profile({ searchParams }) {
  const session = await getServerSession(authOptions); // Get user session
  const tab = searchParams?.tab || 0;

  return <Layout session={session.user} tab={tab}></Layout>;
}
