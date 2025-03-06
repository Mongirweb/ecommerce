import { purchaseSuccedEmailCompany } from "../emails/purchaseSuccedEmailCompanySomos";
import sendgrid from "@sendgrid/mail";
sendgrid.setApiKey(process.env.SENDGRID_API_KEY);
const { EMAIL } = process.env;

export async function sendPurchaseConfirmationEmailToCompanySomos(
  order,
  company
) {
  // Generate email content using the template
  const emailTemplate = purchaseSuccedEmailCompany({
    orderNumber: order._id,
    name: company.name,
  });

  const msg = {
    to: company.email, // User email
    from: EMAIL, // Verified sender email
    subject: `¡Has vendido! Envia tu Pedido Ahora Somos el Hueco`,
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
