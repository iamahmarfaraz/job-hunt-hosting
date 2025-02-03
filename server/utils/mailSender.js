import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

export const mailSender = async (email, title, body) => {
    try {
        const transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS,
            },
        });

        const info = await transporter.sendMail({
            from: 'JobHunt || Go-to platform for job seekers - by Ahmar',
            to: email,
            subject: title,
            html: body,
        });

        console.log(info);
        return info;

    } catch (error) {
        console.error(error.message);
        throw new Error("Error sending email");
    }
};
