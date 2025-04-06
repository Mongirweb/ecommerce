// File: app/checkout/page.jsx

import { getServerSession } from "next-auth"; // Import getServerSession
import User from "../../models/User";
import Cart from "../../models/Cart";
import db from "../../utils/db";
import Header from "../../components/cart/header";
import Head from "next/head";
import { authOptions } from "../api/auth/[...nextauth]/route"; // Adjust the path as needed
import { redirect } from "next/navigation";
import CheckoutClient from "./CheckoutClient";

// **Add the metadata export**
export const metadata = {
  title: "Mongir | Checkout",
};

export default async function Checkout() {
  // Fetch session on the server side

  const session = await getServerSession(authOptions); // Use getServerSession

  if (!session) {
    // If there's no session, redirect to signin page
    return redirect("/signin");
  }

  // Connect to the database
  await db.connectDb();

  // Fetch user and cart data
  const user = await User.findById(session.user.id);
  const cart = await Cart.findOne({ user: user._id }).sort({ updatedAt: -1 });

  await db.disconnectDb();

  if (!cart) {
    // If cart is empty, redirect to cart page
    return redirect("/cart");
  }

  // Parse data to JSON
  const userData = JSON.parse(JSON.stringify(user));
  const cartData = JSON.parse(JSON.stringify(cart));

  // Since we're in a server component, we can't use useState or useEffect directly
  // So, we'll pass the data to a client component

  return (
    <>
      <Header />
      <CheckoutClient cart={cartData} user={userData} />
    </>
  );
}
