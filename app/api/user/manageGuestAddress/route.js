import { NextResponse } from "next/server";
import User from "../../../../models/User";
import db from "../../../../utils/db";
import auth from "../../../../middleware/auth";
import GuestCart from "../../../../models/GuestCart";

export async function PUT(req) {
  try {
    db.connectDb();
    const { id, token } = await req.json();

    let cart = await GuestCart.findOne({ token });
    let user_addresses = cart.address;
    let addresses = [];
    for (let i = 0; i < user_addresses.length; i++) {
      let temp_address = {};
      if (user_addresses[i]._id == id) {
        temp_address = { ...user_addresses[i].toObject(), active: true };
        addresses.push(temp_address);
      } else {
        temp_address = { ...user_addresses[i].toObject(), active: false };
        addresses.push(temp_address);
      }
    }
    await cart.updateOne(
      {
        address: addresses,
      },
      { new: true }
    );

    db.disconnectDb();
    return NextResponse.json({ addresses }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    db.connectDb();
    const { id, token } = await req.json();
    let cart = await GuestCart.findOne({ token });
    await cart.updateOne(
      {
        $pull: { address: { _id: id } },
      },
      { new: true }
    );
    db.disconnectDb();

    return NextResponse.json(
      { addresses: user.address.filter((a) => a._id != id) },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
