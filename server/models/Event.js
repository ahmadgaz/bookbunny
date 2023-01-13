import mongoose from "mongoose";

export const EventSchema = new mongoose.Schema(
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
        event_type_id: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "EventType",
        },
    },
    { timestamps: true }
);

export const Event = mongoose.model("Event", EventSchema);
