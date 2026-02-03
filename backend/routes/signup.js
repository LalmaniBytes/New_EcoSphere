import express from "express";
import bcrypt from "bcryptjs";
import userModel from "../models/user.model.js";
import pendingUsersModel from "../models/pendingUsers.model.js";

const signup = express.Router();
// export const pendingRegistrations = {};

signup.post("/", async (req, res) => {
  const { username, email, password } = req.body;
  console.log("Signup route called ");
  try {
    if (!email) {
      return res.status(400).json({ detail: "All fields are required." });
    }

    const existingUser = await pendingUsersModel.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ detail: "User already signup . Please verify mail." });
    }

    const pendingRegistrations = await pendingUsersModel.create({
      username,
      email,
      password,
      createdAt: new Date(),
    });

    res.status(200).json({
      message: "Registration received. Please verify with Google Sign-In.",
      email,
    });
  } catch (error) {
    console.error("Signup error:", error);
    console.log(error);
    res.status(500).json({ detail: "Server error during signup." });
  }
});
signup.post("/google", async (req, res) => {
  console.log("google singup");
  const { email } = req.body;

  const pending = await pendingUsersModel.find({ email });
  console.log("Pending :", pending);
  if (!pending) {
    return res.status(400).json({ detail: "No pending registration found." });
  }

  const hashedPassword = pending[0].password
    ? await bcrypt.hash(pending[0].password, 10)
    : undefined;
  const user = await userModel.create({
    username: pending[0].username,
    email,
    password: hashedPassword,
    role: pending[0].role,
    isVerified: true,
  });

  await pendingUsersModel.findOneAndDelete({ email });

  res.status(200).json({ user });
});

export default signup;
