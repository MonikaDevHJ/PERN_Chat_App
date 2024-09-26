import express from "express";
import proctecRoute from "../MiddleWar/ProtectRoute";
import {
  getMessages,
  getUserForSidebar,
  sendMessage
} from "../controller/message.controller";

const router = express.Router();

router.get("/conversations", proctecRoute, getUserForSidebar);
router.get("/:id", proctecRoute, getMessages);

router.post("/send/:idx", proctecRoute, sendMessage);

export default router; // Don't forget to export the router!


// Todo : Add socket.io to the server
// Todo : Configure this server for  the deployement