import nodemailer from "nodemailer";
import handlebars from "handlebars";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const sendEmail = async (email, subject, payload, template) => {
    try {
        // create reusable transporter object using the default SMTP transport
        const transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: 465,
            auth: {
                user: process.env.EMAIL_USERNAME,
                pass: process.env.EMAIL_PASSWORD, // naturally, replace both with your real credentials or an application-specific password
            },
        });

        const source = fs.readFileSync(path.join(__dirname, template), "utf8");
        const compiledTemplate = handlebars.compile(source);
        const options = () => {
            return {
                from: process.env.EMAIL_USERNAME,
                to: email,
                subject: subject,
                html: compiledTemplate(payload),
            };
        };
        // Send email
        transporter.sendMail(options(), (error, info) => {
            if (error) {
                return { err: error };
            } else {
                return {
                    success: true,
                };
            }
        });
    } catch (error) {
        return error;
    }
};
