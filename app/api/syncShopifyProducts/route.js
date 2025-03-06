// app/api/syncShopifyProducts/route.js
import { NextResponse } from "next/server";
import db from "../../../utils/db";
import { getVariantInventory } from "../../../utils/shopifyUpdateStock";

export async function GET() {
  // 1) Connect to DB
  await db.connectDb();

  try {
    const shopifyRes = await getVariantInventory();
    console.log(shopifyRes);

    await db.disconnectDb();
    return NextResponse.json({
      success: true,
      message: `connected to shopify`,
    });
  } catch (error) {
    console.error("Error syncing products from Shopify:", error);
    await db.disconnectDb();
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
