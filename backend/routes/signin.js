import express from "express";
import { OAuth2Client } from "google-auth-library";
import bcrypt from "bcryptjs";
import userModel from "../models/user.model.js";

const signin = express.Router();

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const pendingRegistrations = {};

signin.post("/", async (req, res) => {
  const { email, token } = req.body;

  try {
    if (!pendingRegistrations[email]) {
      return res.status(400).json({ detail: "No pending registration for this email." });
    }

    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const verifiedEmail = payload.email;

    if (verifiedEmail !== email) {
      return res.status(401).json({ detail: "Google verification failed." });
    }

    const { username, password } = pendingRegistrations[email];

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await userModel.create({
      username,
      email,
      password: hashedPassword,
      isVerified: true,
      role: "user",
    });

    delete pendingRegistrations[email];

    req.session.user = {
      _id: newUser._id,
      username: newUser.username,
      email: newUser.email,
      role: newUser.role,
      isVerified: newUser.isVerified,
    };

    res.status(201).json({
      message: "Signup successful! Verified via Google.",
      user: req.session.user,
    });
  } catch (error) {
    console.error("Signin error:", error);
    res.status(500).json({ detail: "Server error during Google verification." });
  }
});

export default signin;
