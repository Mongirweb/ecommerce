import sendgrid from "@sendgrid/mail";
sendgrid.setApiKey(process.env.SENDGRID_API_KEY);
const { EMAIL } = process.env;

//send email

export const sendEmail = (to, url, txt, subject, template) => {
  const msg = {
    to: to,
    from: EMAIL,
    subject: subject,
    text: url,
    html: template,
  };

  sendgrid
    .send(msg)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      console.error(error.response.body.errors);
    });
};
