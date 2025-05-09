import { NextResponse } from "next/server";
import Coupon from "../../../../models/Coupon";
import GuestCart from "../../../../models/GuestCart";
import db from "../../../../utils/db";

export async function POST(req) {
  try {
    db.connectDb();
    // Authenticate the user using custom middleware

    const { coupon, token } = await req.json();

    const Cart = await GuestCart.findOne({ token: token });

    const checkCoupon = await Coupon.findOne({ coupon: coupon.toUpperCase() });

    if (checkCoupon == null) {
      return NextResponse.json({ message: "Cupón inválido" });
    }
    const { cartTotal } = await GuestCart.findOne({ token: token });

    let totalAfterDiscount =
      cartTotal - (cartTotal * checkCoupon.discount) / 100;

    await GuestCart.findOneAndUpdate(
      { token: token },
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
