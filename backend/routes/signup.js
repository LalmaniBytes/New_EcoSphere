import express from "express";
import bcrypt from "bcryptjs";
import userModel from "../models/user.model.js";

const signup = express.Router();
export const pendingRegistrations = {};

signup.post("/", async (req, res) => {
  const { username, email, password } = req.body;

  try {
    if (!username || !email || !password) {
      return res.status(400).json({ detail: "All fields are required." });
    }

    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ detail: "User already exists. Please sign in." });
    }

    pendingRegistrations[email] = {
      username,
      password,
      createdAt: new Date(),
    };

    res.status(200).json({
      message: "Registration received. Please verify with Google Sign-In.",
      email,
    });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ detail: "Server error during signup." });
  }
});

export default signup;
