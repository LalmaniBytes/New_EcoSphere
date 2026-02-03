import express from "express";
import { OAuth2Client } from "google-auth-library";
import userModel from "../models/user.model.js";
import signupRouter from "./signup.js"; // import the pendingRegistrations from signup
import jwt from "jsonwebtoken";
import pendingUsersModel from "../models/pendingUsers.model.js";
import bcrypt from "bcryptjs";
import cookie from "cookie-parser";
import { authenticateToken } from "../middleware/jwtAuth.js";

const signin = express.Router();
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Access pendingRegistrations from signup route
const pendingRegistrations = signupRouter.pendingRegistrations;

signin.post("/", async (req, res) => {
  const { email } = req.body;

  try {
    // Step 1: Check if user exists in DB (already signed up)
    let existingUser = await userModel.findOne({ email });
    const pendingUser = await pendingUsersModel.findOne({ email });
    if (pendingUser) {
      return res.status(401).json({
        detail: "Please verify your Gmail to complete registration.", // Send back the user data to pre-populate the verification screen
        user: { email: pendingUser.email },
      });
    }

    if (!existingUser) {
      return res.status(403).json({ message: "No such user found!" });
    }

    const token = jwt.sign(
      { id: existingUser._id, email: existingUser.email ,username : existingUser.username , role : existingUser.role },
      process.env.JWT_SECRET || "your_default_secret",
      { expiresIn: "7d" }, // 30 days
    );
    console.log("Token :", token);
    const cookieOptions = {
      httpOnly: true,
      secure: false, // true in production (HTTPS)
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 30 days
      path: "/",
    };

    res.cookie("token", token, cookieOptions);
    console.log("Login successful");
    res.json({
      message: "Login successful!",
      // token,
      user: {
        id: existingUser._id,
        email: existingUser.email,
        username: existingUser.username,
        role: existingUser.role,
      },
    });
  } catch (error) {
    console.error("Google Signin error:", error);
    res
      .status(500)
      .json({ detail: "Server error during Google verification." }, token);
  }
});

signin.get("/check-cookie", (req, res) => {
  // console.log("Cookies received:", req.cookies);
  res.json(req.cookies);
});

signin.post("/logout", (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: false,   // match login
    sameSite: "lax", // match login
    path: "/",       // match login
  });
  res.json({ message: "Logged out successfully" });
});


export default signin;
