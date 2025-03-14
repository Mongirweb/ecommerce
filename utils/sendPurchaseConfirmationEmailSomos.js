import { purchaseSuccedEmailTemplate } from "../emails/purchaseSuccedEmailTemplateSomos";
import sendgrid from "@sendgrid/mail";
sendgrid.setApiKey(process.env.SENDGRID_API_KEY);
const { EMAIL } = process.env;

export async function sendPurchaseConfirmationEmailSomos(order, user) {
  // Generate email content using the template

  const emailTemplate = purchaseSuccedEmailTemplate({
    orderNumber: order._id,
    name: user.name,
    products: order.products,
    total: order.total,
    shippingAddress: order.shippingAddress,
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
