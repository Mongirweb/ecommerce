import sendgrid from "@sendgrid/mail";
import { resetEmailTemplate } from "../emails/resetEmailTemplate";
sendgrid.setApiKey(process.env.SENDGRID_API_KEY);
const { EMAIL } = process.env;

export async function sendResetEmail(email, url) {
  // Generate email content using the template
  const emailTemplate = resetEmailTemplate({ url });

  const msg = {
    to: email, // User email
    from: EMAIL, // Verified sender email
    subject: `🔒 Recuperar contraseña. Somos el Hueco!.`,
    html: emailTemplate,
  };

  try {
    await sendgrid.send(msg);
  } catch (error) {
    console.error(
      "Error enviando email:",
      error.response?.body?.errors || error
    );
  }
}
