import { NextResponse } from "next/server";
import db from "../../.././../utils/db";
import auth from "../../.././../middleware/auth";
import User from "../../.././../models/User";
import business from "../../.././../middleware/business";

export async function PUT(req) {
  try {
    db.connectDb(); // Ensure database connection
    // Apply middleware
    await auth(req); // Check if the user is authenticated
    await business(req); // Check if the user has 'business' role
    const body = await req.json();
    const { info } = body;

    let user = await User.findById(req.user);

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    

    await user.updateOne(
      {
        businessName: info.businessName,
        businessDescription: info.businessDescription,
        businessAddress: info.businessAddress,
        businessState: info.businessState,
        businessCity: info.businessCity,
        businessCountry: info.businessCountry,
        businessEmail: info.businessEmail,
        businessPhoneNumber: info.businessPhoneNumber,
        businessId: info.businessId,
        bussinesBank: info.bussinesBank,
        bussinesBankAccountType: info.bussinesBankAccountType,
        bussinesBankAccountNumber: info.bussinesBankAccountNumber,
        businessDevolutionAdress: info.businessDevolutionAdress,
        nameOfPersonInCharge: info.nameOfPersonInCharge,
        acceptTerms: info.acceptTerms,
      },
      {
        new: true,
      }
    );

    await db.disconnectDb(); // Ensure database disconnection
    return NextResponse.json({ message: "ok" }, { status: 200 });
  } catch (error) {
    await db.disconnectDb(); // Ensure database disconnection on error
    return NextResponse.json(
      { message: "Server Error" + error.message },
      { status: 500 }
    );
  }
}
