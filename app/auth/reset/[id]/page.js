import { notFound, redirect } from "next/navigation";
import jwt from "jsonwebtoken";

// If you use NextAuth:
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../app/api/auth/[...nextauth]/route";
// ^ Adjust this path to your NextAuth config

import ResetForm from "./ResetForm";

export default async function ResetPage({ params }) {
  // 1) Check if user is already logged in:
  const session = await getServerSession(authOptions);
  if (session) {
    // If user is logged in, redirect them away from reset page
    redirect("/");
  }

  // 2) Extract the token from the dynamic route (e.g. /auth/reset/xxx)
  const { id } = params;
  let userId;

  try {
    // 3) Decode and verify the token
    const decoded = jwt.verify(id, process.env.RESET_TOKEN_SECRET);
    // `decoded` should contain something like { id: "someUserId", iat, exp }
    if (!decoded || !decoded.id) {
      notFound(); // Triggers a 404
    }
    userId = decoded.id; // We’ll pass this to the client component
  } catch (error) {
    console.error("Error verifying token:", error);
    // If token is invalid or expired, we show a 404 (or you can redirect to a custom error page)
  }

  // 4) Render the client form component, passing the userId prop
  return (
    <div>
      {/* Or do your own layout wrapper here. */}
      <ResetForm userId={userId} />
    </div>
  );
}
