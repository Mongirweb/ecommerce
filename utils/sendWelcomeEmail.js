import sendgrid from "@sendgrid/mail";
import { welcomeEmailTemplate } from "../emails/welcomeEmailTemplate";
sendgrid.setApiKey(process.env.SENDGRID_API_KEY);
const { EMAIL } = process.env;

export async function sendWelcomeEmail(email, name) {
  // Generate email content using the template
  const emailTemplate = welcomeEmailTemplate({ name });

  const msg = {
    to: email, // User email
    from: EMAIL, // Verified sender email
    subject: `¡Bienvenido a Somos el Hueco!`,
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
