import express from "express";
import passport from "passport";
import { createUser, findUserByEmail } from "../../../models/User.js";

const router = express.Router();

// Middleware to parse JSON body
router.use(express.json());

// Create new user (signup)
router.post("/signup", async (req, res, next) => {
  try {
    const { name, email, password, age } = req.body;

    // Validate input
    if (!name || !email || !password || !age) {
      return res.status(400).json({
        message:
          "Missing required fields: name, email, password, and age are required",
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        message: "Invalid email format",
      });
    }

    // Validate password strength
    if (password.length < 8) {
      return res.status(400).json({
        message: "Password must be at least 8 characters long",
      });
    }

    // Check if user already exists
    const existingUser = await findUserByEmail(email);
    if (existingUser.success) {
      return res.status(400).json({
        message: "Email already in use",
      });
    }

    // Create new user
    const result = await createUser(name, email, password, age);

    if (result.success) {
      return res.status(201).json({
        message: "User created successfully",
        user: {
          id: result.data.id,
          name: result.data.name,
          email: result.data.email,
          age: result.data.age,
        },
      });
    } else {
      throw new Error("Error creating user");
    }
  } catch (err) {
    next(err);
  }
});

// Login route
router.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      return next(err);
    }

    if (!user) {
      return res.status(401).json({ message: info.message });
    }

    req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }

      return res.json({
        message: "Login successful",
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
      });
    });
  })(req, res, next);
});

// Facebook authentication routes
router.get(
  "/facebook",
  passport.authenticate("facebook", { scope: ["email"] })
);

router.get(
  "/facebook/callback",
  passport.authenticate("facebook", { failureRedirect: "/login" }),
  (req, res) => {
    res.redirect("/");
  }
);

// Google authentication routes
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  (req, res) => {
    res.redirect("/");
  }
);

// Twitter authentication routes
router.get("/twitter", passport.authenticate("twitter"));

router.get(
  "/twitter/callback",
  passport.authenticate("twitter", { failureRedirect: "/login" }),
  (req, res) => {
    res.redirect("/");
  }
);

// LinkedIn authentication routes
router.get("/linkedin", passport.authenticate("linkedin"));

router.get(
  "/linkedin/callback",
  passport.authenticate("linkedin", { failureRedirect: "/login" }),
  (req, res) => {
    res.redirect("/");
  }
);

// Logout route
router.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ message: "Error during logout" });
    }
    res.json({ message: "Logged out successfully" });
  });
});

// Get current user info
router.get("/me", (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  res.json({
    user: {
      id: req.user.id,
      name: req.user.name,
      email: req.user.email,
      age: req.user.age,
    },
  });
});

export default router;
