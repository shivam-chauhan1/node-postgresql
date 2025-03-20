import express from "express";
import studentController from "./controllers/studentController.js";
import authController from "./controllers/authController.js";
import session from "express-session";
import { setupPassport } from "../../middleware/auth.js";
import { errorHandler } from "../../middleware/errorHandler.js";
import config from "../../config/index.js";

const router = express.Router();

// Set up session
router.use(
  session({
    secret: config.sessionSecret,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    },
  })
);

// Initialize passport
setupPassport(router);

// Routes
router.use("/students", studentController);
router.use("/auth", authController);

// Error handler middleware
router.use(errorHandler);

export default router;
