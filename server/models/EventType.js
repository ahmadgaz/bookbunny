import mongoose from "mongoose";
import { EventSchema } from "./Event.js";

export const EventTypeSchema = new mongoose.Schema(
    {
        owner_id: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "User",
        },
        view_id: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "View",
        },
        events: [EventSchema],
    },
    { timestamps: true }
);

export const EventType = mongoose.model("EventType", EventTypeSchema);
