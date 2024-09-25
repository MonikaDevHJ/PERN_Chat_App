import express from "express";
import { login, logout, signup, getMe } from "../controller/auth.controller";
import proctecRoute from "../MiddleWar/ProtectRoute";

const router = express.Router();

router.get("/me",  proctecRoute ,  getMe)

router.post("/signup", signup);

router.post("/login", login);

router.post("/logout", logout);

export default router; // Don't forget to export the router!
