import sendgrid from "@sendgrid/mail";
import { activateEmailTemplate } from "../emails/activateEmailTemplate";
sendgrid.setApiKey(process.env.SENDGRID_API_KEY);
const { EMAIL } = process.env;

export async function sendConfirmationEmail(name, email, url) {
  // Generate email content using the template
  const emailTemplate = activateEmailTemplate({
    name,
    url,
  });

  const msg = {
    to: email, // User email
    from: EMAIL, // Verified sender email
    subject: `✉️Confirmar Correo Electronico - Saldomanía`,
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
