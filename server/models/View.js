import mongoose from "mongoose";
import { EventTypeSchema } from "./EventType.js";

export const ViewSchema = new mongoose.Schema(
    {
        owner_id: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "User",
        },
        view_name: {
            type: String,
            required: true,
            min: 2,
            max: 100,
        },
        view_desc: {
            type: String,
            max: 1000,
        },
        view_color: {
            type: String,
            required: true,
        },
        view_schedule: [
            {
                sunday: [{ start_time: String, end_time: String }],
                monday: [{ start_time: String, end_time: String }],
                tuesday: [{ start_time: String, end_time: String }],
                wednesday: [{ start_time: String, end_time: String }],
                thursday: [{ start_time: String, end_time: String }],
                friday: [{ start_time: String, end_time: String }],
                saturday: [{ start_time: String, end_time: String }],
            },
        ],
        view_selected: {
            type: Boolean,
            required: true,
        },
        event_types: [EventTypeSchema],
    },
    { timestamps: true }
);

export const View = mongoose.model("View", ViewSchema);
