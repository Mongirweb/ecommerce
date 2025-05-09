import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(req) {
  try {
    const body = await req.json();
    const { transactionReference, amountInCents, currency, expirationTime } =
      body;

    // Wompi  secret for generating the hash
    const integritySecret =
      process.env.NEXT_SECRET_TECNIC_INTEGRATION_INTEGRITY_TEST;

    // Concatenate the values in the correct order
    let concatenatedString = `${transactionReference}${amountInCents}${currency}${integritySecret}`;

    // // If expirationTime is present, concatenate it
    // if (expirationTime) {
    //   concatenatedString = `${transactionReference}${amountInCents}${currency}${expirationTime}${integritySecret}`;
    // }

    // Generate the SHA-256 hash using Node.js crypto module
    const hash = crypto
      .createHash("sha256")
      .update(concatenatedString)
      .digest("hex");

    // Return the response with the hash
    return NextResponse.json({ integritySignature: hash }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "An error occurred", error },
      { status: 500 }
    );
  }
}
