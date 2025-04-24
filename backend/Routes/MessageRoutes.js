const express = require("express");
const messageController = require("../Controller/MessageController");
// import messageController from "../Controller/MessageController.js";



const router = express.Router();

// router.post("/contact",messageController.contactUs);
router.post("/send", messageController.sendMessage);

module.exports = router;
