// app/api/pqrs/route.js
import sendgrid from "@sendgrid/mail";
import sanitizeHtml from "sanitize-html";

sendgrid.setApiKey(process.env.SENDGRID_API_KEY);

function sanitizeFields(dataObj) {
  const sanitized = {};
  for (const key in dataObj) {
    if (typeof dataObj[key] === "string") {
      // Strip out all HTML tags and attributes
      sanitized[key] = sanitizeHtml(dataObj[key], {
        allowedTags: [],
        allowedAttributes: {},
      });
    } else {
      // If it's not a string (e.g. number, boolean), just keep as-is
      sanitized[key] = dataObj[key];
    }
  }
  return sanitized;
}

export async function POST(req) {
  try {
    // 1) Parse the JSON body
    const data = await req.json();

    // 2) Sanitize all string fields
    const safeData = sanitizeFields(data);

    // 3) Destructure sanitized form data
    const {
      name,
      surnames,
      documentType,
      documentNumber,
      email,
      telephone,
      address,
      city,
      pqrsType,
      pqrsOrderNumber,
      pqrsText,
    } = safeData;

    // 4) Build the email HTML content
    const emailto = "peticiones@somoselhueco.com";
    const message = `
      <h1>Nuevo PQRS Recibido</h1>
      <h2>Datos Personales</h2>
      <p><strong>Nombre:</strong> ${name}</p>
      <p><strong>Apellidos:</strong> ${surnames}</p>
      <p><strong>Tipo de Documento:</strong> ${documentType}</p>
      <p><strong>Número de Documento:</strong> ${documentNumber}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Teléfono:</strong> ${telephone}</p>
      <p><strong>Dirección:</strong> ${address}</p>
      <p><strong>Ciudad:</strong> ${city}</p>
      <h2>Datos Solicitud</h2>
      <p><strong>Tipo de Solicitud:</strong> ${pqrsType}</p>
      <p><strong>Número de Orden:</strong> ${pqrsOrderNumber}</p>
      <p><strong>Texto:</strong> ${pqrsText}</p>
    `;

    // 5) Configure email data to send to your internal team
    const mailData = {
      to: emailto,
      from: process.env.EMAIL,
      subject: "Nuevo PQRS Recibido",
      html: message,
    };

    // 6) Configure email data to send back to the user as confirmation
    const userMailData = {
      to: email,
      from: process.env.EMAIL,
      subject: "Confirmación de Recepción de PQRS",
      html: `
        <h1>Gracias por tu PQRS</h1>
        <p>Hemos recibido tu solicitud y la procesaremos en breve.</p>
        ${message}
      `,
    };

    // 7) Send both emails
    await sendgrid.send(mailData);
    await sendgrid.send(userMailData);

    return new Response(
      JSON.stringify({ message: "Email sent successfully" }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error sending email:", error);
    return new Response(JSON.stringify({ error: "Error sending email" }), {
      status: 500,
    });
  }
}
