// app/wishlist/page.jsx
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../api/auth/[...nextauth]/route";
import User from "../../../models/User";
import Product from "../../../models/Product";
import WishlistClient from "./wishListClient";

export default async function WishlistPage({ searchParams }) {
  const tab = searchParams?.tab || 0;
  const session = await getServerSession(authOptions);

  // Redirect to sign-in page if not authenticated
  if (!session) {
    redirect("/signin");
  }

  // Fetch user's wishlist from the database
  const user = await User.findById(session.user.id).select("wishlist").lean();

  // Populate the wishlist with product details
  const wishlistWithDetails = await Promise.all(
    user.wishlist.map(async (item) => {
      const productDetails = await Product.findById(item.product).lean();
      return {
        ...item,
        productDetails,
      };
    })
  );

  return (
    <WishlistClient
      session={session}
      tab={tab}
      wishlist={wishlistWithDetails}
    />
  );
}
