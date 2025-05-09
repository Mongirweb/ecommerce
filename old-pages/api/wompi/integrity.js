import crypto from "crypto";
import { createRouter } from "next-connect";

const router = createRouter();

router.post(async (req, res) => {
  if (req.method === "POST") {
    const { transactionReference, amountInCents, currency, expirationTime } =
      req.body;

    // Wompi secret for generating the hash
    const integritySecret =
      process.env.NEXT_SECRET_TECNIC_INTEGRATION_INTEGRITY;

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

    // Send the hash back to the client
    res.status(200).json({ integritySignature: hash });
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
});

export default router.handler();
