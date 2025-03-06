import { NextResponse } from "next/server";
import db from "../../../../utils/db";
import User from "../../../../models/User";
import { createResetToken } from "../../../../utils/tokens";
import { sendEmail } from "../../../../utils/sendEmails";
import { resetEmailTemplate } from "../../../../emails/resetEmailTemplate";
import { sendResetEmail } from "../../../../utils/sendResetEmail";

export async function POST(req) {
  try {
    await db.connectDb();
    const { email } = await req.json();
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { message: "Este correo no esta registrado." },
        { status: 400 }
      );
    }
    const user_id = createResetToken({
      id: user._id.toString(),
    });
    const url = `${process.env.BASE_URL}/auth/reset/${user_id}`;
    sendResetEmail(email, url);
    await db.disconnectDb();
    return NextResponse.json({
      message: "Link de recuperación enviado a tu correo.",
    });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
