import sendgrid from "@sendgrid/mail";
import { assignPassword } from "../emails/assignPassword";
sendgrid.setApiKey(process.env.SENDGRID_API_KEY);
const { EMAIL } = process.env;

export async function sendAssignNewPassword(email) {
  // Generate email content using the template
  const emailTemplate = assignPassword();

  const msg = {
    to: email, // User email
    from: EMAIL, // Verified sender email
    subject: `🔒✅¡Contraseña asignada con éxito!`,
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
