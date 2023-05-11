import mongoose from "mongoose";

export const TokenSchema = new mongoose.Schema(
    {
        owner_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        first_name: {
            type: String,
            min: 2,
            max: 50,
        },
        last_name: {
            type: String,
            min: 2,
            max: 50,
        },
        email: {
            type: String,
            max: 50,
            unique: true,
        },
        // timezone: {

        // },
        password: {
            type: String,
            min: 5,
        },
        token: {
            type: String,
            required: true,
        },
        createdAt: {
            type: Date,
            default: Date.now,
            expires: 3600, // this is the expiry time in seconds
        },
    },
    { timestamps: true }
);

const Token = mongoose.model("Token", TokenSchema);

export default Token;
