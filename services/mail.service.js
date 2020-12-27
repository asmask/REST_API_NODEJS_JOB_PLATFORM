const sgMail = require('@sendgrid/mail');
const key = require("../utils/key");
sgMail.setApiKey(key.sendgridKey);

const mailService = () => {

  const send = async ({ to, subject, content }) => {
    const msg = {
        to,
        from: 'no-reply@JOB-PLATFORM.com',
        subject,
        text: content,
        html: `
            <h2>JOB PLATFORM Email Service:</h2>
            <p>${content}</p>
        `,
    }
    sgMail.send(msg)
}

return {
    send
}
}

module.exports = mailService