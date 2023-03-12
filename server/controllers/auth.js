import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import fetch from "node-fetch";

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
                tokens: tokens,
                views: [],
            });
            const savedUser = await newUser.save();

            let secureUser = savedUser._doc;
            delete secureUser.tokens;

            const token = jwt.sign(
                { id: secureUser._id },
                process.env.JWT_SECRET
            );

            res.status(200).json({ token, user: secureUser });
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

            user.tokens = tokens;
            const savedUser = await user.save();

            let secureUser = savedUser._doc;
            delete secureUser.tokens;

            const token = jwt.sign(
                { id: secureUser._id },
                process.env.JWT_SECRET
            );

            res.status(200).json({ token, user: secureUser });
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

            delete user.password;

            let secureUser = user._doc;
            delete secureUser.password;

            const token = jwt.sign(
                { id: secureUser._id },
                process.env.JWT_SECRET
            );

            res.status(200).json({ token, user: secureUser });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
