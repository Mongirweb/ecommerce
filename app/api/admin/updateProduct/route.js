// app/api/updateProduct/route.js

import { NextResponse } from "next/server";
import { updateProducts } from "../../../../utils/updateProducts";

export async function POST(request) {
  try {
    await updateProducts();
    return NextResponse.json(
      { message: "Products updated successfully." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating products:", error);
    return NextResponse.json(
      { message: "Error updating products.", error },
      { status: 500 }
    );
  }
}

// Optionally handle GET requests
export async function GET(request) {
  return NextResponse.json(
    { message: "Please use POST method to update products." },
    { status: 405 }
  );
}
