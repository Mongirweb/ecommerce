import { purchaseSuccedEmailTemplate } from "../emails/purchaseSuccedEmailTemplateSomos";
import sendgrid from "@sendgrid/mail";
sendgrid.setApiKey(
  "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"
);
const { EMAIL } = process.env;

export async function sendPurchaseConfirmationEmailSomos(order, user) {
  // Generate email content using the template

  const shipping = order.total - order.totalBeforeDiscount;

  const emailTemplate = purchaseSuccedEmailTemplate({
    orderNumber: order._id,
    name: user?.name
      ? user?.name
      : order?.shippingAddress?.firstName +
        " " +
        order?.shippingAddress?.lastName,
    products: order.products,
    total: order.total,
    shipping: shipping,
    shippingAddress: order.shippingAddress,
    trackingUrl: order?.trackingInfo?.trackingUrl,
  });

  const msg = {
    to: user.email, // User email
    from: "notificaciones@somoselhueco.com", // Verified sender email
    subject: `¡📦✅ Pedido confirmado! Somos el Hueco!`,
    html: emailTemplate,
  };

  try {
    await sendgrid.send(msg);
  } catch (error) {
    console.error(
      "Error sending email:",
      error.response?.body?.errors || error
    );
  }
}
