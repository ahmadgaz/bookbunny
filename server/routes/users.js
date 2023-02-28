import express from "express";
import {
    getUser,
    getRecievingUser,
    getFirstFourUsers,
    getAttendeesInfo,
    createEvent,
    getEvent,
    acceptEvent,
    deleteEvent,
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
router.get("/getRecievingUser/:eventType", getRecievingUser);
router.get("/getFirstFourUsers/:filter", verifyToken, getFirstFourUsers);
router.get("/getAttendeesInfo/:event", verifyToken, getAttendeesInfo);

// EVENTS
router.post("/:user/:eventType/createEvent", verifyToken, createEvent);
router.get("/:user/getEvent/:event", verifyToken, getEvent);
router.patch("/:user/acceptEvent/:event", verifyToken, acceptEvent);
router.delete("/:user/deleteEvent/:event", verifyToken, deleteEvent);

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
