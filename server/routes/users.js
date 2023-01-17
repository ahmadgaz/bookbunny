import express from "express";
import {
    getUser,
    createView,
    getView,
    updateView,
    deleteView,
    createEventType,
    getEventType,
    updateEventType,
    deleteEventType,
} from "../controllers/users.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

// USER
router.get("/:user", verifyToken, getUser);

// EVENT TYPES
router.post("/:user/:view/createEventType", verifyToken, createEventType);
router.get("/:user/:view/getEventType/:eventType", verifyToken, getEventType);
router.patch(
    "/:user/:view/updateEventType/:eventType",
    verifyToken,
    updateEventType
);
router.delete(
    "/:user/:view/deleteEventType/:eventType",
    verifyToken,
    deleteEventType
);

// VIEWS
router.post("/:user/createView", verifyToken, createView);
router.get("/:user/getView/:view", verifyToken, getView);
router.patch("/:user/updateView/:view", verifyToken, updateView);
router.delete("/:user/deleteView/:view", verifyToken, deleteView);

export default router;
