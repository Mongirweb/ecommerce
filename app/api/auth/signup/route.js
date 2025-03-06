import bcrypt from "bcrypt";
import { NextResponse } from "next/server";
import { validateEmail } from "../../../../utils/validation";
import db from "../../../../utils/db";
import User from "../../../../models/User";
import { createActivationToken } from "../../../../utils/tokens";
import { sendConfirmationEmail } from "../../../../utils/sendConfirmationEmail";
import { sendWelcomeEmail } from "../../../../utils/sendWelcomeEmail";

export async function POST(req) {
  try {
    await db.connectDb();
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { message: "Porfavor llena todos los campos." },
        { status: 400 }
      );
    }

    if (!validateEmail(email)) {
      return NextResponse.json({ message: "Email invalido." }, { status: 400 });
    }

    const user = await User.findOne({ email });
    if (user) {
      return NextResponse.json(
        { message: "Este correo ya esta registrado." },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { message: "Password debe contener al menos 6 caracteres." },
        { status: 400 }
      );
    }

    const cryptedPassword = await bcrypt.hash(password, 12);
    const newUser = new User({ name, email, password: cryptedPassword });

    const addedUser = await newUser.save();
    const activation_token = createActivationToken({
      id: addedUser._id.toString(),
    });

    const url = `${process.env.BASE_URL}/activate/${activation_token}`;
    await sendWelcomeEmail(email, name);
    // await sendConfirmationEmail(name, email, url);
    await db.disconnectDb();

    return NextResponse.json({
      message: "Registro Exitoso! revisa tu correo electronico.",
    });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
