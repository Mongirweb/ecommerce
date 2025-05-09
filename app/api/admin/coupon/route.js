import auth from "../../../../middleware/auth";
import admin from "../../../../middleware/admin";
import Coupon from "../../../../models/Coupon";
import db from "../../../../utils/db";
import slugify from "slugify";

export async function POST(req) {
  try {
    const { coupon, discount, startDate, endDate } = await req.json();
    await auth(req);
    await admin(req);

    await db.connectDb();
    const existingCoupon = await Coupon.findOne({ coupon });

    if (existingCoupon) {
      return new Response(
        JSON.stringify({
          message: "Coupon already exists. Try a different name.",
        }),
        { status: 400 }
      );
    }

    await new Coupon({ coupon, discount, startDate, endDate }).save();
    const coupons = await Coupon.find({}).sort({ updatedAt: -1 });
    await db.disconnectDb();

    return new Response(
      JSON.stringify({
        message: `Coupon ${coupon} has been created successfully.`,
        coupons,
      }),
      { status: 200 }
    );
  } catch (error) {
    await db.disconnectDb();
    return new Response(JSON.stringify({ message: error.message }), {
      status: 500,
    });
  }
}

export async function DELETE(req) {
  try {
    const { id } = await req.json();
    await auth(req);
    await admin(req);

    await db.connectDb();
    await Coupon.findByIdAndDelete(id);
    const coupons = await Coupon.find({}).sort({ updatedAt: -1 });
    await db.disconnectDb();

    return new Response(
      JSON.stringify({
        message: "Coupon has been deleted successfuly",
        coupons,
      }),
      { status: 200 }
    );
  } catch (error) {
    await db.disconnectDb();
    return new Response(JSON.stringify({ message: error.message }), {
      status: 500,
    });
  }
}

export async function PUT(req) {
  try {
    const { id, coupon, discount, startDate, endDate } = await req.json();
    await auth(req);
    await admin(req);

    await db.connectDb();
    await Coupon.findByIdAndUpdate(id, {
      coupon,
      discount,
      startDate,
      endDate,
    });
    const coupons = await Coupon.find({}).sort({ updatedAt: -1 });
    await db.disconnectDb();
    return new Response(
      JSON.stringify({
        message: "Coupon has been updated successfuly",
        coupons,
      }),
      { status: 200 }
    );
  } catch (error) {
    await db.disconnectDb();
    return new Response(JSON.stringify({ message: error.message }), {
      status: 500,
    });
  }
}

// export default handler;
