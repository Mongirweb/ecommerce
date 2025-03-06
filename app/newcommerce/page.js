import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route"; // Path to auth options
import NewCommerce from "./NewCommerce"; // Adjust path if necessary

export default async function NewCommercePage() {
  const session = await getServerSession(authOptions); // Fetch session server-side

  return <NewCommerce session={session} />;
}
