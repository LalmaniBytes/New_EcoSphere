
import mongoose from "mongoose";
const pendingUserSchema = new mongoose.Schema(
  {
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }, // store hashed later
    role : { type: String, required: true  , default : "user"} , 
    createdAt: { type: Date, default: Date.now, expires: "10m" },
    // 🔹 auto-delete after 10 minutes
  },
  { timestamps: true }
);

export default mongoose.model("PendingEmails",pendingUserSchema)