import nodemailer from 'nodemailer'
import config from '../config';
export const sendEmail = async (to: string, html: string) => {
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // Use `true` for port 465, `false` for all other ports
        auth: {
            user: "shahadathossain.sh255@gmail.com",
            pass: config.email_sender_pass,
        },
    });
    // send mail with defined transport object
    const info = await transporter.sendMail({
        from: 'shahadathossain.sh255@gmail.com', // sender address
        to, // list of receivers
        subject: "Reset your password within 5 minutes", // Subject line
        text: " ", // plain text body
        html, // html body
    });

}