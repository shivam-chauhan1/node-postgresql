import express from "express";
import http from "http";
import path from "path";
import { fileURLToPath } from "url";
import config from "./config/index.js";
import api from "./api/index.js";
import { errorHandler } from "./middleware/errorHandler.js";
import session from "express-session";
import passport from "passport";
import { setupPassport } from "./middleware/auth.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use(express.static(path.join(__dirname, "public")));

// Session setup - must be before passport initialization
app.use(
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

// Initialize Passport in the main app
app.use(passport.initialize());
app.use(passport.session());
setupPassport(app);

// API routes
app.use("/api", api);

// Serve HTML forms
app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "login.html"));
});

app.get("/signup", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "signup.html"));
});

app.get("/", (req, res) => {
  if (req.isAuthenticated()) {
    res.sendFile(path.join(__dirname, "public", "dashboard.html"));
  } else {
    res.redirect("/login");
  }
});

// Global error handler
app.use(errorHandler);

const server = http.createServer(app);

server.listen(config.serverPort, () => {
  console.log("Server listening on port", config.serverPort);
});
