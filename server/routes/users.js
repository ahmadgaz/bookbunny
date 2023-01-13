import express from "express";
import {
    addView,
    getAllViews,
    updateView,
    deleteView,
} from "../controllers/users.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

// CREATE
router.post("/:user/addView", addView);
// READ
router.get("/:user/getAllViews", getAllViews);
// UPDATE
router.patch("/:user/updateView/:view", updateView);
// DELETE
router.delete("/:user/deleteView/:view", deleteView);

export default router;
