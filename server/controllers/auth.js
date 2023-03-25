import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import fetch from "node-fetch";
import path from "path";
import { promises as fsp } from "fs";
import { authenticate } from "@google-cloud/local-auth";
import { google } from "googleapis";

// // GOOGLE OAUTH
// const SCOPES = [
//     "openid",
//     "email",
//     "profile",
//     "https://www.googleapis.com/auth/userinfo.profile",
//     "https://www.googleapis.com/auth/userinfo.email",
//     "https://www.googleapis.com/auth/calendar",
//     "https://www.googleapis.com/auth/calendar.events",
// ].join(" ");
// const TOKEN_PATH = path.join(process.cwd(), "token.json");
// async function loadSavedCredentialsIfExist() {
//     try {
//         const content = await fs.readFile(TOKEN_PATH);
//         const credentials = JSON.parse(content);
//         return google.auth.fromJSON(credentials);
//     } catch (err) {
//         return null;
//     }
// }
// async function saveCredentials(tokens) {
//     const payload = JSON.stringify({
//         type: "authorized_user",
//         client_id: process.env.GOOGLE_CLIENT_ID,
//         client_secret: process.env.GOOGLE_CLIENT_SECRET,
//         refresh_token: tokens.refresh_token,
//     });
//     await fs.writeFile(TOKEN_PATH, payload);
// }
// async function authorize() {
//     let client = await loadSavedCredentialsIfExist();
//     if (client) {
//         return client;
//     }

//     client = await authenticate({
//         scopes: SCOPES,
//         keyfilePath: CREDENTIALS_PATH,
//     });
//     if (client.credentials) {
//         await saveCredentials(client);
//     }
//     return client;
// }

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

            const credentials = {
                type: "authorized_user",
                client_id: process.env.GOOGLE_CLIENT_ID,
                client_secret: process.env.GOOGLE_CLIENT_SECRET,
                refresh_token: newUser.googleTokens.refresh_token,
            };
            const client = google.auth.fromJSON(credentials);
            const calendar = google.calendar({ version: "v3", auth: client });
            calendar.events.watch(
                {
                    calendarId: "primary",
                    requestBody: {
                        type: "web_hook",
                        address: `${process.env.SERVER_BASE_URL}/test`,
                    },
                },
                (err, res) => {
                    if (err) {
                        console.error(err);
                        return;
                    }
                    console.log("Subscription response:", res.data);
                }
            );

            const savedUser = await newUser.save();

            let secureUser = savedUser._doc;
            delete secureUser.googleTokens;

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

            const salt = await bcrypt.genSalt();
            const passwordHash = await bcrypt.hash(password, salt);

            const newUser = new User({
                first_name,
                last_name,
                email,
                // timezone,
                password: passwordHash,
                views: [],
            });
            const savedUser = await newUser.save();

            let secureUser = savedUser._doc;
            delete secureUser.password;

            res.status(201).json(secureUser);
        }
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

            user.googleTokens = tokens;
            user.loginToken = jwt.sign(
                { id: user._id },
                process.env.JWT_SECRET
            );

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
            //         console.log("Subscription response:", res.data);
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

            const isMatch = bcrypt.compare(password, user.password);
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
