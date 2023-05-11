import express from "express";
import {
    forgotPassword,
    resetPassword,
    register,
    createConfirmedUser,
    login,
} from "../controllers/auth.js";

const router = express.Router();

router.post("/forgotPassword", forgotPassword);
router.post("/resetPassword", resetPassword);
router.post("/register", register);
router.post("/createConfirmedUser", createConfirmedUser);
router.post("/login", login);

export default router;
