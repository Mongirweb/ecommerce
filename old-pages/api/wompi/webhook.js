import { createRouter } from "next-connect";
import crypto from "crypto";
import db from "../../../utils/db";
import Order from "../../../models/Order";
import bodyParser from "body-parser";

const router = createRouter();
router.use(bodyParser.json());

router.post(async (req, res) => {
  try {
    const event = req.body;

    // Log the received event to check its structure
    console.log("Received Wompi Event: ", JSON.stringify(event, null, 2));

    // Extract the X-Event-Checksum from the headers
    const providedChecksum = req.headers["x-event-checksum"];
    console.log("Received X-Event-Checksum: ", providedChecksum);

    // Validate the event signature
    const isValid = validateWompiEvent(event, providedChecksum);

    if (!isValid) {
      console.error("Invalid Wompi event signature.");
      return res.status(400).json({ error: "Invalid signature" });
    }

    // Handle the Wompi event (e.g., update order status in the database)
    await handleWompiEvent(event);

    res.status(200).json({ message: "Event received" });
  } catch (error) {
    console.error("Error handling Wompi event:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

function validateWompiEvent(event, providedChecksum) {
  const properties = event.signature.properties;
  const timestamp = event.timestamp;
  const integritySecret =
    process.env.NEXT_SECRET_TECNIC_INTEGRATION_EVENTS_TEST; // Ensure this is set in your environment variables

  // Step 1: Concatenate property values
  let concatenatedProperties = "";
  properties.forEach((propertyPath) => {
    const value = getPropertyValue(event.data, propertyPath);
    concatenatedProperties += value;
  });

  // Step 2: Concatenate the timestamp
  const concatenatedString = `${concatenatedProperties}${timestamp}`;

  // Step 3: Concatenate your secret
  const finalString = `${concatenatedString}${integritySecret}`;

  // Step 4: Generate SHA256 hash
  const hash = crypto.createHash("sha256").update(finalString).digest("hex");

  // Step 5: Compare checksums
  return hash === providedChecksum;
}

function getPropertyValue(data, propertyPath) {
  const properties = propertyPath.split(".");
  let value = data;

  for (const prop of properties) {
    value = value[prop];
    if (value === undefined || value === null) {
      return "";
    }
  }

  return value.toString();
}

async function handleWompiEvent(event) {
  const { event: eventType, data } = event;

  switch (eventType) {
    case "transaction.updated":
      await handleTransactionUpdated(data.transaction);
      break;
    default:
      console.log(`Unhandled event type: ${eventType}`);
  }
}

async function handleTransactionUpdated(transaction) {
  const transactionId = transaction.id;
  const status = transaction.status;
  const orderReference = transaction.reference;

  // Fetch the order from your database using the reference
  const order = await getOrderByReference(orderReference);

  if (!order) {
    console.error(`Order with reference ${orderReference} not found.`);
    return;
  }

  // Avoid processing the same event multiple times
  if (
    order.paymentResult &&
    order.paymentResult.id === transactionId &&
    order.paymentResult.status === status
  ) {
    console.log(`Transaction ${transactionId} already processed.`);
    return;
  }

  // Update the order based on transaction status
  if (status === "APPROVED") {
    order.isPaid = true;
    order.paidAt = new Date();
    order.paymentResult = {
      id: transactionId,
      status: status,
      update_time: transaction.finalized_at,
    };
    order.status = "Processing";
    await order.save();
    console.log(`Order ${orderReference} marked as paid.`);
  } else if (
    status === "DECLINED" ||
    status === "ERROR" ||
    status === "VOIDED"
  ) {
    order.isPaid = false;
    order.paymentResult = {
      id: transactionId,
      status: status,
      update_time: transaction.finalized_at,
    };
    await order.save();
    console.log(`Order ${orderReference} payment declined or errored.`);
  } else {
    // Handle other statuses if necessary
    console.log(`Transaction ${transactionId} updated with status ${status}.`);
  }
}

async function getOrderByReference(reference) {
  await db.connectDb();
  const order = await Order.findById(reference);
  await db.disconnectDb();
  return order;
}

export default router.handler({
  onError: (err, req, res) => {
    console.error(err.stack);
    res.status(500).json({ error: "Something went wrong!" });
  },
});
