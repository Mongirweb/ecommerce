// File: app/signin/page.jsx

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import dynamic from "next/dynamic";

const Signin = dynamic(() => import("./Signin"), { ssr: true });

export default async function SigninPage({ searchParams }) {
  const session = await getServerSession(authOptions);

  // If user is already logged in, redirect to callback URL or home
  if (session) {
    return redirect(searchParams?.callbackUrl || "/");
  }

  // Get CSRF token from headers
  const headersList = headers();
  const host = headersList.get("host");

  // Fetch providers
  const providersResponse = await fetch(
    `${process.env.NEXTAUTH_URL}/api/auth/providers`
  );
  const providers = await providersResponse.json();

  // Fetch CSRF token
  const csrfResponse = await fetch(`${process.env.NEXTAUTH_URL}/api/auth/csrf`);
  const { csrfToken } = await csrfResponse.json();

  // Extract callbackUrl from searchParams
  const callbackUrl = searchParams?.callbackUrl || "/";

  return (
    <Signin
      providers={providers}
      csrfToken={csrfToken}
      callbackUrl={callbackUrl}
    />
  );
}
