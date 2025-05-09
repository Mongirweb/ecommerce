import { NextResponse } from "next/server";
import User from "../../../../models/User";
import Coupon from "../../../../models/Coupon";
import Cart from "../../../../models/Cart";
import db from "../../../../utils/db";
import auth from "../../../../middleware/auth";

export async function POST(req) {
  try {
    db.connectDb();
    // Authenticate the user using custom middleware
    await auth(req); // This will attach `req.user`

    if (!req.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { coupon } = await req.json();

    const user = User.findById(req.user);

    const checkCoupon = await Coupon.findOne({ coupon: coupon.toUpperCase() });

    if (checkCoupon == null) {
      return NextResponse.json({ message: "Cupón inválido" });
    }
    const { cartTotal } = await Cart.findOne({ user: req.user });

    let totalAfterDiscount =
      cartTotal - (cartTotal * checkCoupon.discount) / 100;

    await Cart.findOneAndUpdate(
      { user: user._id },
      { totalAfterDiscount: Math.round(totalAfterDiscount) }
    );

    db.disconnectDb();

    return NextResponse.json({
      totalAfterDiscount: Math.round(totalAfterDiscount),
      discount: checkCoupon.discount,
    });
  } catch (error) {
    return NextResponse.json(
      { message: `Internal Server Error: ${error.message}` },
      { status: 500 }
    );
  }
}
