import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import fetch from "node-fetch";
import Token from "../models/Token.js";
import { sendEmail } from "../utils/sendEmail.js";
import mongoose from "mongoose";

// FORGOT PASSWORD
export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({
            email: { $regex: email, $options: "i" },
        });
        if (!user) return res.status(400).json({ msg: "User does not exist!" });
        if (user.googleTokens)
            return res.status(400).json({
                msg: "This account is associated with a google account! Please login with google.",
            });

        const token = await Token.findOne({ owner_id: user._id });
        if (token) await token.deleteOne();
        let resetToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
        const salt = await bcrypt.genSalt();
        const resetTokenHash = await bcrypt.hash(resetToken, salt);

        await new Token({
            owner_id: user._id,
            token: resetTokenHash,
            createdAt: Date.now(),
        }).save();

        const link = `${process.env.CLIENT_BASE_URL}/reset_password/${resetToken}/${user._id}`;
        await sendEmail(
            user.email,
            "Password Reset Request",
            { name: `${user.first_name} ${user.last_name}`, link: link },
            "./template/requestResetPassword.handlebars"
        );
        res.status(200).json({ msg: "Email has been sent!" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
export const resetPassword = async (req, res) => {
    try {
        let { userId, token, password } = req.body;
        userId = mongoose.Types.ObjectId(userId);
        let passwordResetToken = await Token.findOne({ owner_id: userId });
        if (!passwordResetToken)
            return res
                .status(400)
                .json({ msg: "Invalid or expired password reset token" });
        const isValid = await bcrypt.compare(token, passwordResetToken.token);
        if (!isValid)
            return res
                .status(400)
                .json({ msg: "Invalid or expired password reset token" });

        const salt = await bcrypt.genSalt();
        const passwordHash = await bcrypt.hash(password, salt);
        await User.updateOne(
            { _id: userId },
            { $set: { password: passwordHash } },
            { new: true }
        );
        const user = await User.findById({ _id: userId });
        await sendEmail(
            user.email,
            "Password Reset Successfully",
            {
                name: user.name,
            },
            "./template/resetPassword.handlebars"
        );
        await passwordResetToken.deleteOne();
        return res.status(400).json({ msg: "Password reset!" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// REGISTER USER
export const register = async (req, res) => {
    try {
        if (req.body.googleCode) {
            // Get token
            const tokensResponse = await fetch(
                "https://oauth2.googleapis.com/token",
                {
                    method: "POST",
                    body: JSON.stringify({
                        code: req.body.googleCode,
                        client_id: process.env.GOOGLE_CLIENT_ID,
                        client_secret: process.env.GOOGLE_CLIENT_SECRET,
                        redirect_uri: "postmessage",
                        grant_type: "authorization_code",
                    }),
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );
            const tokens = await tokensResponse.json();
            // await saveCredentials(tokens);

            // Get user
            const googleOAuthResponse = await fetch(
                "https://www.googleapis.com/oauth2/v2/userinfo",
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${tokens.access_token}`,
                    },
                }
            );
            const googleOAuth = await googleOAuthResponse.json();

            if (!googleOAuth.verified_email) {
                res.status(403).json({
                    error: "Google account is not verified!",
                });
            }

            const {
                given_name: first_name,
                family_name: last_name,
                email,
            } = googleOAuth;

            const userAlreadyExists = await User.findOne({ email: email });
            if (userAlreadyExists)
                return res
                    .status(400)
                    .json({ msg: "Email is already in use!" });

            const newUser = new User({
                first_name,
                last_name,
                email,
                // timezone,
                googleTokens: tokens,
                views: [],
            });
            newUser.loginToken = jwt.sign(
                { id: newUser._id },
                process.env.JWT_SECRET
            );

            // EVENTS NOTIFICATIONS WEB HOOK
            // const credentials = {
            //     type: "authorized_user",
            //     client_id: process.env.GOOGLE_CLIENT_ID,
            //     client_secret: process.env.GOOGLE_CLIENT_SECRET,
            //     refresh_token: newUser.googleTokens.refresh_token,
            // };
            // const client = google.auth.fromJSON(credentials);
            // const calendar = google.calendar({ version: "v3", auth: client });
            // calendar.events.watch(
            //     {
            //         calendarId: "primary",
            //         requestBody: {
            //             type: "web_hook",
            //             address: `${process.env.SERVER_BASE_URL}/test`,
            //         },
            //     },
            //     (err, res) => {
            //         if (err) {
            //             console.error(err);
            //             return;
            //         }
            //     }
            // );

            const savedUser = await newUser.save();

            let secureUser = savedUser._doc;
            delete secureUser.googleTokens;

            await sendEmail(
                secureUser.email,
                "Welcome to Bookbunny!",
                { name: `${secureUser.first_name} ${secureUser.last_name}` },
                "./template/welcome.handlebars"
            );

            res.status(200).json({
                token: secureUser.loginToken,
                user: secureUser,
            });
        } else {
            const {
                first_name,
                last_name,
                email,
                // timezone,
                password,
            } = req.body;

            const userAlreadyExists = await User.findOne({ email: email });
            if (userAlreadyExists)
                return res
                    .status(400)
                    .json({ msg: "Email is already in use!" });

            const passSalt = await bcrypt.genSalt();
            const passwordHash = await bcrypt.hash(password, passSalt);

            const token = await Token.findOne({ email });
            if (token) await token.deleteOne();
            let confirmToken = jwt.sign({ id: email }, process.env.JWT_SECRET);

            await new Token({
                first_name,
                last_name,
                email,
                // timezone,
                password: passwordHash,
                token: confirmToken,
                createdAt: Date.now(),
            }).save();

            const link = `${process.env.CLIENT_BASE_URL}/confirmation/${confirmToken}`;
            await sendEmail(
                email,
                "Confirm your email",
                { name: `${first_name} ${last_name}`, link: link },
                "./template/confirmationEmail.handlebars"
            );

            res.status(201).json({
                msg: "Confirmation email sent! Check your inbox and follow the instructions.",
            });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
export const createConfirmedUser = async (req, res) => {
    try {
        let { token } = req.body;
        let confirmationToken = await Token.findOne({ token });
        if (!confirmationToken)
            return res
                .status(400)
                .json({ msg: "Invalid or expired password reset token!" });

        const newUser = new User({
            first_name: confirmationToken.first_name,
            last_name: confirmationToken.last_name,
            email: confirmationToken.email,
            // timezone,
            password: confirmationToken.password,
            views: [],
        });
        const savedUser = await newUser.save();

        let secureUser = savedUser._doc;
        delete secureUser.password;

        await confirmationToken.deleteOne();

        await sendEmail(
            secureUser.email,
            "Welcome to Bookbunny!",
            { name: `${secureUser.first_name} ${secureUser.last_name}` },
            "./template/welcome.handlebars"
        );

        res.status(201).json({ msg: "Your email has been confirmed!" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// LOGGING IN
export const login = async (req, res) => {
    try {
        if (req.body.googleCode) {
            // Get token
            const tokensResponse = await fetch(
                "https://oauth2.googleapis.com/token",
                {
                    method: "POST",
                    body: JSON.stringify({
                        code: req.body.googleCode,
                        client_id: process.env.GOOGLE_CLIENT_ID,
                        client_secret: process.env.GOOGLE_CLIENT_SECRET,
                        redirect_uri: "postmessage",
                        grant_type: "authorization_code",
                    }),
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );
            const tokens = await tokensResponse.json();

            // Get user
            const googleOAuthResponse = await fetch(
                "https://www.googleapis.com/oauth2/v2/userinfo",
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${tokens.access_token}`,
                    },
                }
            );
            const googleOAuth = await googleOAuthResponse.json();

            const { email } = googleOAuth;
            const user = await User.findOne({
                email: { $regex: email, $options: "i" },
            });
            if (!user)
                return res.status(400).json({ msg: "User does not exist!" });
            if (!user.googleTokens)
                return res.status(400).json({
                    msg: "This google account is not linked to a Bookbunny account!",
                });

            user.googleTokens = tokens;
            user.loginToken = jwt.sign(
                { id: user._id },
                process.env.JWT_SECRET
            );

            // EVENTS NOTIFICATIONS WEB HOOK
            // const credentials = {
            //     type: "authorized_user",
            //     client_id: process.env.GOOGLE_CLIENT_ID,
            //     client_secret: process.env.GOOGLE_CLIENT_SECRET,
            //     refresh_token: user.googleTokens.refresh_token,
            // };
            // const client = google.auth.fromJSON(credentials);
            // const calendar = google.calendar({ version: "v3", auth: client });
            // calendar.events.watch(
            //     {
            //         calendarId: "primary",
            //         requestBody: {
            //             type: "web_hook",
            //             address: `${process.env.SERVER_BASE_URL}/test`,
            //         },
            //     },
            //     (err, res) => {
            //         if (err) {
            //             console.error(err);
            //             return;
            //         }
            //     }
            // );

            const savedUser = await user.save();

            let secureUser = savedUser._doc;
            delete secureUser.googleTokens;

            res.status(200).json({
                token: secureUser.loginToken,
                user: secureUser,
            });
        } else {
            const { email, password } = req.body;
            const user = await User.findOne({
                email: { $regex: email, $options: "i" },
            });
            if (!user)
                return res.status(400).json({ msg: "User does not exist!" });
            if (!user.password)
                return res.status(400).json({ msg: "Invalid login method." });

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch)
                return res.status(400).json({ msg: "Invalid credentials!" });

            user.loginToken = jwt.sign(
                { id: user._id },
                process.env.JWT_SECRET
            );
            const savedUser = await user.save();

            let secureUser = savedUser._doc;
            delete secureUser.password;

            res.status(200).json({
                token: secureUser.loginToken,
                user: secureUser,
            });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
