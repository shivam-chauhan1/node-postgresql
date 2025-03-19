import express from "express";
import studentController from "./controllers/studentController.js";

const router = express.Router();

router.use("/students", studentController);

export default router;
