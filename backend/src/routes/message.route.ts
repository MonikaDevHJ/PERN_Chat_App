import express from "express";
import proctecRoute from "../MiddleWar/ProtectRoute";
import { sendMessage } from "../controller/message.controller";

const router = express.Router();


router.post("/send/:idx", proctecRoute, sendMessage);

export default router; // Don't forget to export the router!

  