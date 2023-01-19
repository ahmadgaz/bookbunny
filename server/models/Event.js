import mongoose from "mongoose";

export const EventSchema = new mongoose.Schema(
    {
        owner_id: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "User",
        },
        event_type_id: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "EventType",
        },
        event_date: { type: Date, required: true },
        event_notes: { type: String, max: 1000 },
        event_attendees: [
            {
                type: mongoose.Schema.Types.ObjectId,
                required: true,
                ref: "User",
            },
        ],
        event_status: { type: String, required: true },
        event_attending: { type: Boolean },
    },
    { timestamps: true }
);

export const Event = mongoose.model("Event", EventSchema);
