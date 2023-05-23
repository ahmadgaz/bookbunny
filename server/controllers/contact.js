import { sendEmail } from "../utils/sendEmail.js";

export const contact = async (req, res) => {
    try {
        const { first_name, last_name, email, message } = req.body;

        await sendEmail(
            "support@bookbunny.net",
            `New Support Ticket!`,
            {
                name: `${first_name} ${last_name}`,
                email: email,
                message: message,
            },
            "./template/newSupportTicket.handlebars"
        );

        res.status(201).json({ msg: "Message has been sent!" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
