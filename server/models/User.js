import mongoose from "mongoose";
import { ViewSchema } from "./View.js";
import { EventSchema } from "./Event.js";

const UserSchema = new mongoose.Schema(
    {
        first_name: {
            type: String,
            required: true,
            min: 2,
            max: 50,
        },
        last_name: {
            type: String,
            required: true,
            min: 2,
            max: 50,
        },
        email: {
            type: String,
            required: true,
            max: 50,
            unique: true,
        },
        // timezone: {

        // },
        password: {
            type: String,
            required: true,
            min: 5,
        },
        views: [ViewSchema],
        events: [EventSchema],
    },
    { timestamps: true }
);

const User = mongoose.model("User", UserSchema);

export default User;
