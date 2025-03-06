import { NextResponse } from "next/server";
import User from "../../../../models/User";
import db from "../../../../utils/db";
import auth from "../../../../middleware/auth";

export async function PUT(req) {
  try {
    db.connectDb();
    await auth(req);
    const { id } = await req.json();
    let user = await User.findById(req.user);
    let user_addresses = user.address;
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
    await user.updateOne(
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
    await auth(req);
    const { id } = await req.json();
    const user = await User.findById(req.user);
    await user.updateOne(
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
