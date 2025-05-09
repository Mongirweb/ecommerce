// app/business/sales/page.js

import React from "react";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../api/auth/[...nextauth]/route";
import db from "../../../../utils/db";
import Coupon from "../../../../models/Coupon";
import CouponsPage from "./CouponsPage"; // The client component we’ll create below

export const metadata = {
  title: "Somos el Hueco Medellín - Cupones",
};

export default async function Sales() {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/auth/signin");
  }

  // 1) Connect to DB
  await db.connectDb();

  // 2) Fetch all *paid* orders for this company
  const coupons = await Coupon.find({}).sort({ createdAt: -1 }).lean();

  await db.disconnectDb();

  return <CouponsPage coupons={coupons} />;
}
