import mongoose from "mongoose";
import User from "../models/User.js";
import { View } from "../models/View.js";

// USER
export const getUser = async (req, res) => {
    try {
        req.params.user = mongoose.Types.ObjectId(req.params.user);
        const user = await User.findOne({
            _id: req.params.user,
        }).exec();
        res.status(201).json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// VIEWS
export const createView = async (req, res) => {
    try {
        const { view_name, view_desc = "", view_color } = req.body;

        // Find user
        req.params.user = mongoose.Types.ObjectId(req.params.user);
        let user = await User.findOne({ _id: req.params.user }).exec();

        // New View Instance
        const newView = new View({
            owner_id: req.params.user,
            view_name,
            view_desc,
            view_color,
            view_schedule: {
                sunday: [],
                monday: [],
                tuesday: [],
                wednesday: [],
                thursday: [],
                friday: [],
                saturday: [],
            },
            view_selected: true,
            event_types: [],
        });

        // Unselect old view
        if (user.views.length > 0) {
            const oldView = await View.findOne({ view_selected: true }).exec();
            oldView.view_selected = false;
            user.views.forEach((view) => {
                view.view_selected = false;
            });
            await oldView.save();
        }

        // Save view and user
        user.views = [...user.views, newView];
        const savedNewView = await newView.save();
        await user.save();

        res.status(201).json(savedNewView);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
export const getView = async (req, res) => {
    try {
        req.params.view = mongoose.Types.ObjectId(req.params.view);
        req.params.user = mongoose.Types.ObjectId(req.params.user);
        const view = await View.findOne({
            _id: req.params.view,
            owner_id: req.params.user,
        }).exec();
        res.status(201).json(view);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
export const updateView = async (req, res) => {
    try {
        const {
            view_name,
            view_desc,
            view_color,
            view_schedule,
            view_selected,
        } = req.body;

        // Find view
        req.params.view = mongoose.Types.ObjectId(req.params.view);
        req.params.user = mongoose.Types.ObjectId(req.params.user);
        let view = await View.findOne({
            _id: req.params.view,
            owner_id: req.params.user,
        }).exec();
        let user = await User.findOne({ _id: req.params.user }).exec();

        // Update view
        view.view_name = view_name;
        view.view_desc = view_desc;
        view.view_color = view_color;
        view.view_schedule = view_schedule;
        view.view_selected = view_selected;
        // Update view in user
        user.views.forEach((v, idx) => {
            if (v._id.toString() === view._id.toString()) {
                user.views[idx] = view;
            }
        });

        // Save view
        const savedView = await view.save();
        await user.save();

        res.status(201).json(savedView);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
export const deleteView = async (req, res) => {
    try {
        // Find view
        req.params.view = mongoose.Types.ObjectId(req.params.view);
        req.params.user = mongoose.Types.ObjectId(req.params.user);
        let user = await User.findOne({ _id: req.params.user }).exec();

        // Delete view
        await View.deleteOne({
            _id: req.params.view,
            owner_id: req.params.user,
        }).exec();
        user.views.forEach((v, idx) => {
            if (v._id.toString() === req.params.view.toString()) {
                user.views.splice(idx, 1);
            }
        });

        // Save user
        await user.save();

        res.status(201).json("Deleted");
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// EVENT TYPES
export const createEventType = async (req, res) => {
    try {
        const { event_type_name, event_type_duration, event_type_location } =
            req.body;

        // Find user
        req.params.user = mongoose.Types.ObjectId(req.params.user);
        req.params.view = mongoose.Types.ObjectId(req.params.view);
        let user = await User.findOne({ _id: req.params.user }).exec();

        // New View Instance
        const newView = new View({
            owner_id: req.params.user,
            view_name,
            view_desc,
            view_color,
            view_schedule: {
                sunday: [],
                monday: [],
                tuesday: [],
                wednesday: [],
                thursday: [],
                friday: [],
                saturday: [],
            },
            view_selected: true,
            event_types: [],
        });

        // Unselect old view
        if (user.views.length > 0) {
            const oldView = await View.findOne({ view_selected: true }).exec();
            oldView.view_selected = false;
            user.views.forEach((view) => {
                view.view_selected = false;
            });
            await oldView.save();
        }

        // Save view and user
        user.views = [...user.views, newView];
        const savedNewView = await newView.save();
        await user.save();

        res.status(201).json(savedNewView);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
export const getEventType = async (req, res) => {
    try {
        req.params.view = mongoose.Types.ObjectId(req.params.view);
        req.params.user = mongoose.Types.ObjectId(req.params.user);
        const view = await View.findOne({
            _id: req.params.view,
            owner_id: req.params.user,
        }).exec();
        res.status(201).json(view);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
export const updateEventType = async (req, res) => {
    try {
        const {
            view_name,
            view_desc,
            view_color,
            view_schedule,
            view_selected,
        } = req.body;

        // Find view
        req.params.view = mongoose.Types.ObjectId(req.params.view);
        req.params.user = mongoose.Types.ObjectId(req.params.user);
        let view = await View.findOne({
            _id: req.params.view,
            owner_id: req.params.user,
        }).exec();
        let user = await User.findOne({ _id: req.params.user }).exec();

        // Update view
        view.view_name = view_name;
        view.view_desc = view_desc;
        view.view_color = view_color;
        view.view_schedule = view_schedule;
        view.view_selected = view_selected;
        // Update view in user
        user.views.forEach((v, idx) => {
            if (v._id.toString() === view._id.toString()) {
                user.views[idx] = view;
            }
        });

        // Save view
        const savedView = await view.save();
        await user.save();

        res.status(201).json(savedView);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
export const deleteEventType = async (req, res) => {
    try {
        // Find view
        req.params.view = mongoose.Types.ObjectId(req.params.view);
        req.params.user = mongoose.Types.ObjectId(req.params.user);
        let user = await User.findOne({ _id: req.params.user }).exec();

        // Delete view
        await View.deleteOne({
            _id: req.params.view,
            owner_id: req.params.user,
        }).exec();
        user.views.forEach((v, idx) => {
            if (v._id.toString() === req.params.view.toString()) {
                user.views.splice(idx, 1);
            }
        });

        // Save user
        await user.save();

        res.status(201).json("Deleted");
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
