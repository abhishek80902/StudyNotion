const nodemailer = require("nodemailer");

const mailSender = async(email, subject, body) => {
    try {
        // Create transporter with Gmail SMTP
        let transporter = nodemailer.createTransport({
            service: "gmail", // Use Gmail service
            auth: {
                user: process.env.MAIL_USER, // Your Gmail address
                pass: process.env.MAIL_PASS, // App password (NOT your Gmail password)
            },
        });

        // Send email
        let info = await transporter.sendMail({
            from: `"StudyNotion" <${process.env.MAIL_USER}>`, // Sender info
            to: email, // Recipient
            subject: subject, // Email subject
            html: body, // HTML body
        });

        console.log("Email sent: ", info.response);
        return info;
    } catch (error) {
        console.error("Error sending mail: ", error.message);
        throw error;
    }
};

module.exports = mailSender;