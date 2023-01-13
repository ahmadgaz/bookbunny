import mongoose from "mongoose";
import User from "../models/User.js";
import { View } from "../models/View.js";

// CREATE
export const addView = async (req, res) => {
    try {
        const { view_name, view_desc, view_color, view_schedule } = req.body;

        // Find user
        req.params.user = mongoose.Types.ObjectId(req.params.user);
        let user = await User.findOne({ _id: req.params.user }).exec();

        // New View Instance
        const newView = new View({
            owner_id: req.params.user,
            view_name,
            view_desc,
            view_color,
            view_schedule,
            view_selected: true,
            event_types: [],
        });

        // Update User
        user.views = [...user.views, newView];
        const savedUser = await user.save();

        res.status(201).json(savedUser);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// READ
export const getAllViews = async (req, res) => {
    try {
        req.params.user = mongoose.Types.ObjectId(req.params.user);
        const user = await User.findOne({ _id: req.params.user }).exec();
        res.status(201).json(user.views);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// UPDATE
export const updateView = async (req, res) => {
    try {
        const { view_name, view_desc, view_color, view_schedule } = req.body;

        // Find view
        req.params.user = mongoose.Types.ObjectId(req.params.user);
        req.params.view = mongoose.Types.ObjectId(req.params.view);
        let view = await View.findOne({
            _id: req.params.view,
            owner_id: req.params.user,
        }).exec();

        res.status(201).json(view);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// DELETE
export const deleteView = async (req, res) => {
    try {
        res.status(201).json();
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
