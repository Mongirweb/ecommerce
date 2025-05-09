import { NextResponse } from "next/server";
import Product from "../../../../models/Product";
import db from "../../../../utils/db";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(req) {
  await db.connectDb();
  try {
    // Grab a random sample of 10 products
    const recommendedData = await Product.aggregate([
      { $sample: { size: 10 } },
    ]);

    return new NextResponse(JSON.stringify(recommendedData), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching recommended products:", error);
    return new NextResponse(
      JSON.stringify({ message: "Error fetching recommended products" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  } finally {
    await db.disconnectDb();
  }
}
