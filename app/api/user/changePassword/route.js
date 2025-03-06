import { NextResponse } from "next/server";
import User from "../../../../models/User";
import db from "../../../../utils/db";
import auth from "../../../../middleware/auth";
import bcrypt from "bcrypt";
import { sendAssignNewPassword } from "../../../../utils/sendAssignNewPassword";

export async function PUT(req) {
  try {
    await db.connectDb();
    // Attach `req.user` from the 'auth' middleware
    await auth(req);
    const { current_password, password } = await req.json();

    // Find the user in DB
    const user = await User.findById(req.user);

    if (!user) {
      return NextResponse.json(
        { message: "Usuario no encontrado." },
        { status: 404 }
      );
    }

    // Hash the new password right away
    const crypted_password = await bcrypt.hash(password, 12);

    // 1) If the user was created with Google => no password in DB
    if (!user.password) {
      await user.updateOne({ password: crypted_password });
      await db.disconnectDb();
      return NextResponse.json(
        {
          message:
            "Notamos que iniciaste sesión con Google, así que asignamos esta contraseña para que puedas iniciar sesión con ella en el futuro.",
        },
        { status: 200 }
      );
    }

    // 2) If the user does have a password, verify the current password first
    const isMatch = await bcrypt.compare(current_password, user.password);
    if (!isMatch) {
      await db.disconnectDb();
      return NextResponse.json(
        {
          message: "Tu contraseña actual es incorrecta.",
        },
        { status: 400 }
      );
    }
    sendAssignNewPassword(user.email);
    // 3) Update password if matched
    await user.updateOne({ password: crypted_password });
    await db.disconnectDb();

    return NextResponse.json(
      {
        message: "Contraseña cambiada con éxito.",
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: `Error interno del servidor: ${error.message}` },
      { status: 500 }
    );
  }
}
