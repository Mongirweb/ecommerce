import sendgrid from "@sendgrid/mail";
import { successResetEmailTemplate } from "../emails/successResetEmailTemplate";
sendgrid.setApiKey(process.env.SENDGRID_API_KEY);
const { EMAIL } = process.env;

export async function sendSuccessResetEmail(email, url) {
  // Generate email content using the template
  const emailTemplate = successResetEmailTemplate({ url });

  const msg = {
    to: email, // User email
    from: EMAIL, // Verified sender email
    subject: `🔒✅ ¡Contraseña actualizada con éxito! Somos el Hueco`,
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
