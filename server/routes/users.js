import express from "express";
import {
    isConnectedToGoogle,
    getGoogleEvents,
    getUser,
    updateName,
    updatePass,
    confirmPassword,
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

// GOOGLE
router.get("/:user/isConnectedToGoogle", verifyToken, isConnectedToGoogle);
router.post("/:user/getGoogleEvents", verifyToken, getGoogleEvents);

// USER
router.get("/:user", verifyToken, getUser);
router.patch("/:user/updateName", verifyToken, updateName); //
router.patch("/:user/updatePass", verifyToken, updatePass); //
router.post("/:user/confirmPassword", verifyToken, confirmPassword); //
router.get("/:user/getRecievingUser/:eventType", verifyToken, getRecievingUser); //
router.get("/:user/getFirstFourUsers/:filter", verifyToken, getFirstFourUsers); //
router.get("/:user/getAttendeesInfo/:event", verifyToken, getAttendeesInfo); //

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
