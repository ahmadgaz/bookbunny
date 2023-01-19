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
        event_type_name: {
            type: String,
            required: true,
            max: 100,
        },
        event_type_duration: {
            type: String,
            required: true,
        },
        event_type_location: { type: String },
    },
    { timestamps: true }
);

const EventType = mongoose.model("EventType", EventTypeSchema);

export default EventType;
