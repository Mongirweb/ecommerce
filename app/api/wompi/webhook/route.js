// /app/api/wompi-webhook/route.ts

import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import db from "../../../../utils/db";
import Order from "../../../../models/Order";
import GuestCart from "../../../../models/GuestCart";
import Product from "../../../../models/Product";
import User from "../../../../models/User";
import { sendPurchaseConfirmationEmailSomos } from "../../../../utils/sendPurchaseConfirmationEmailSomos";
import { sendPurchaseConfirmationEmailToCompanySomos } from "../../../../utils/sendPurchaseConfirmationToCompanySomos";

export async function POST(req) {
  try {
    const event = await req.json();

    // Extract the X-Event-Checksum from the headers
    const providedChecksum = req.headers.get("x-event-checksum");

    // Validate the event signature
    const isValid = validateWompiEvent(event, providedChecksum);

    if (!isValid) {
      console.error("Invalid Wompi event signature.");
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    // Handle the Wompi event (e.g., update order status in the database)
    await handleWompiEvent(event);

    return NextResponse.json({ message: "Event received" }, { status: 200 });
  } catch (error) {
    console.error("Error handling Wompi event:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

function validateWompiEvent(event, providedChecksum) {
  const properties = event.signature.properties;
  const timestamp = event.timestamp;
  const integritySecret =
    process.env.NEXT_SECRET_TECNIC_INTEGRATION_EVENTS_TEST;

  if (!providedChecksum || !integritySecret) {
    return false;
  }

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
  const paymentMethod = transaction.payment_method?.type;
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
    order.paymentMethod = paymentMethod;
    order.status = "Procesando";
    await order.save();

    // 1. Update "sold" and "quantity" for each product in the order
    for (let item of order.products) {
      const dbProduct = await Product.findById(item.product);
      if (!dbProduct) {
        console.error(`Product with ID ${item.product} not found.`);
        continue;
      }

      // 2. Extract UID from the item object, not from order
      const uid = item.uid; // <--- change here!
      if (!uid) {
        console.error(
          `Product item.uid is missing or undefined for product ${item.product}.`
        );
        continue;
      }

      // 3. Parse subProdIndex and sizeIndex from uid
      const parts = uid.split("_");
      if (parts.length < 2) {
        console.error(`UID has an unexpected format: ${uid}`);
        continue;
      }

      // Example: "6776b431443fd57863706bc9_0_0"
      // parts = ["6776b431443fd57863706bc9", "0", "0"]
      const subProdIndex = parseInt(parts[parts.length - 2], 10); // => 0
      const sizeIndex = parseInt(parts[parts.length - 1], 10); // => 0

      if (isNaN(subProdIndex) || isNaN(sizeIndex)) {
        console.error(
          `Failed to parse subProdIndex or sizeIndex from UID: ${uid}`
        );
        continue;
      }

      // 4. Update sub-product stats
      dbProduct.subProducts[subProdIndex].sold += item.qty;
      dbProduct.subProducts[subProdIndex].totalSold += item.qty;

      // If you track inventory at the size level
      if (
        dbProduct.subProducts[subProdIndex].sizes &&
        dbProduct.subProducts[subProdIndex].sizes[sizeIndex] &&
        dbProduct.subProducts[subProdIndex].sizes[sizeIndex].qty !== undefined
      ) {
        dbProduct.subProducts[subProdIndex].sizes[sizeIndex].qty -= item.qty;
      }

      await dbProduct.save();
      console.log(
        `Updated subProduct ${item.subProduct} for product ${item.product}:` +
          ` sold +${item.qty}, quantity -${item.qty}`
      );
    }

    try {
      // Assuming order is an object with shipping details.
      let guestToken = "";
      let userId = order.user;
      let user = await User.findById(userId);

      if (!user) {
        guestToken = order.guestToken;
        const guest = await GuestCart.findOne({ token: guestToken });
        if (!guest) {
          console.error("Guest not found or missing email");
          return;
        }
        user = guest;
      }
      const shipmentPayload = {
        email: user.email,
        shippingAddress: order.shippingAddress,
      };

      const shipmentResponse = await fetch(
        `${process.env.NEXTAUTH_URL}/api/envia/quote`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(shipmentPayload),
        }
      );
      if (!shipmentResponse.ok) {
        console.error(
          "Error from /api/envia/quote:",
          await shipmentResponse.text()
        );
      }
      const data = await shipmentResponse.json();
      order?.trackingInfo?.carrier = data.carrier;
      order?.trackingInfo?.service = data.service;
      order?.trackingInfo?.price = data.price;
      order?.trackingInfo?.email = data.email;
      order?.trackingInfo?.trackingNumber =
        data?.genrateResponse?.data[0].trackingNumber;
      order?.trackingInfo?.trackingUrl = data.genrateResponse.data[0].trackUrl;
      order.trackingInfo.trackingLabel = data.genrateResponse.data[0].label;
      await order.save();
      // Save the tracking/shipping number in your order record.
      order.trackingNumber = data.trackingNumber; // adjust according to Envia's response structure.
      await order.save();
      console.log("Envia shipment created:", shipmentResponse);
    } catch (error) {
      // Handle errors (e.g., log, notify admin, retry later)
      console.error("Error syncing shipping data with Envia:", error);
    }

    let guestToken = "";
    let userId = order.user;
    let user = await User.findById(userId);

    if (!user) {
      guestToken = order.guestToken;
      const guest = await GuestCart.findOne({ token: guestToken });
      if (!guest) {
        console.error("Guest not found or missing email");
        return;
      }
      user = guest;
    }
    await sendPurchaseConfirmationEmailSomos(order, user);

    // Fetch and send emails to companies involved in the order
    const allCompanies = await Promise.all(
      order.companies.map(async (companyId) => {
        const company = await User.findById(companyId); // Assuming companies are stored as Users
        if (company && company.email) {
          await sendPurchaseConfirmationEmailToCompanySomos(order, company);
          console.log(`Email sent to company: ${company.email}`);
        }
        return company;
      })
    );
  } else if (["DECLINED", "ERROR", "VOIDED"].includes(status)) {
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
