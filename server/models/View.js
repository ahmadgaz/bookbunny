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
        view_schedule: {
            sunday: { type: [Object], required: true },
            monday: { type: [Object], required: true },
            tuesday: { type: [Object], required: true },
            wednesday: { type: [Object], required: true },
            thursday: { type: [Object], required: true },
            friday: { type: [Object], required: true },
            saturday: { type: [Object], required: true },
        },
        view_selected: {
            type: Boolean,
            required: true,
        },
        event_types: [EventTypeSchema],
    },
    { timestamps: true }
);

export const View = mongoose.model("View", ViewSchema);
