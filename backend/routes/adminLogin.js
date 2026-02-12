import express from "express";

const adminLogin = express.Router();

adminLogin.post("/login", (req, res) => {
  const { email, password } = req.body;

  console.log("Admin Login Attempt:", { email, password });

  try {
    if (
      email === process.env.ADMIN_EMAIL &&
      password === process.env.ADMIN_PASSWORD
    ) {
      return res.status(200).json({
        success: true,
        message: "Admin login successful!",
      });
    } else {
      return res.status(401).json({
        success: false,
        message: "Invalid admin credentials!",
      });
    }
  } catch (error) {
    console.error("Admin Login error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error during admin login.",
    });
  }
});

adminLogin.get("/check", (req, res) => {
  res.json({ message: "Admin login is active." });
});

export default adminLogin;
