// app/checkout/page.jsx
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation"; // <-- add this

import User from "../../models/User";
import Cart from "../../models/Cart";
import GuestCart from "../../models/GuestCart";
import db from "../../utils/db";
import Header from "../../components/cart/header";
import CheckoutClient from "./CheckoutClient";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { getGuestToken } from "../../utils/setGuestToken";
import { cookies } from "next/headers";

// -----------------------------------------------------
// If you read cookies, the page can’t be prerendered:
// -----------------------------------------------------
export const dynamic = "force-dynamic"; // or dynamicParams = true

export const metadata = {
  title: "Somos el Hueco Medellín | Checkout",
};

export default async function Checkout() {
  // 1️⃣  Session (logged-in user)
  const session = await getServerSession(authOptions);

  // 2️⃣  Guest token (anonymous user)
  const cookieStore = await cookies();
  const guestToken = cookieStore.get("guest_token")?.value;

  // 3️⃣  Fetch data ---------------------------------------------------
  await db.connectDb();

  const user = session ? await User.findById(session?.user?.id) : null;

  let cart = user
    ? await Cart.findOne({ user: user._id }).sort({ updatedAt: -1 })
    : null;

  if (!cart && guestToken) {
    cart = await GuestCart.findOne({ token: guestToken }).sort({
      updatedAt: -1,
    });
  }

  await db.disconnectDb();

  // 4️⃣  Guard-rails: nothing to show → back to cart or signin
  if (!cart) {
    return redirect("/cart"); // or "/signin" — your call
  }

  // 5️⃣  Pass plain JSON down to the client component
  return (
    <>
      <Header session={session} />
      <CheckoutClient
        cart={JSON.parse(JSON.stringify(cart))}
        user={JSON.parse(JSON.stringify(user))}
        guestToken={guestToken}
      />
    </>
  );
}
