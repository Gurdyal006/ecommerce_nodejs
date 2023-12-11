import sgMail from "@sendgrid/mail";

// Set your SendGrid API key
sgMail.setApiKey(process.env.SEND_GRID_API_KEY);

const options = {
  to: req.body.email, // body email
  from: req.user.email, // login user email
  subject: " checking Test Email from Node.js",
  text: "Hello, this is a test email!",
};

await sgMail.send(options);
