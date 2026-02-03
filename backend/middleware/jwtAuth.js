import jwt from "jsonwebtoken";
import userModel from "../models/user.model.js";


export const authenticateToken = async (req, res, next) => {
  // const authHeader = req.headers['authorization'];
  try {
    const token =
      req.cookies?.token || req.headers?.authorization?.split(" ")[1];
    console.log("AUth token :", token);
    if (!token)
      return res.status(401).json({ message: "Access denied, token missing!" });

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "your_default_secret",
    );

    // Always fetch latest user from DB
    const user = await userModel.findById(decoded.id).select("-password");
    if (!user) return res.status(401).json({ message: "User not found!" });

    req.user = {
      id: user._id.toString(),
      role: user.role,
      username: user.username,
      // add other fields you want
    };
    console.log("Token USER : ", user);
    next();
  } catch (err) {
    console.error("Auth error", err);
    return res.status(403).json({ message: "Invalid or expired token!" });
  }
};
