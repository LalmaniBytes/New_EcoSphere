import React, { useState } from "react";
import axios from "axios";
import { GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button.jsx";

const SignupPage = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [isPending, setIsPending] = useState(false); // Google step
  const [user, setUser] = useState(null);

  const navigate = useNavigate();

  // STEP 1: Signup
  const handleSignup = async (e) => {
    e.preventDefault();

    if (!username || !email || !password || !confirmPassword) {
      return alert("All fields are required.");
    }

    if (password !== confirmPassword) {
      return alert("Passwords do not match.");
    }

    try {
      setLoading(true);
      const { data } = await axios.post("/signup", {
        username,
        email,
        password,
      });

      alert(data.message || "Signup successful! Please verify with Google.");
      setIsPending(true); // show Google verification
    } catch (err) {
      console.error(err.response?.data || err);
      alert(err.response?.data?.detail || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  // STEP 2: Google Verification
  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const token = credentialResponse.credential;
      const profile = JSON.parse(atob(token.split(".")[1]));

      if (profile.email !== email) {
        return alert("Please use the same email you signed up with.");
      }

      const { data } = await axios.post("/signup/google", {
        email,
        token,
      });

      setUser(data.user);
      alert(`Welcome ${data.user.username}! Signup complete.`);
      navigate("/");
    } catch (err) {
      console.error(err.response?.data || err);
      alert(err.response?.data?.detail || "Google verification failed");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-semibold mb-4 text-center">Sign Up</h2>

      {/* STEP 1 FORM */}
      {!isPending && (
        <form onSubmit={handleSignup} className="flex flex-col space-y-3">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="border rounded px-3 py-2"
          />

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border rounded px-3 py-2"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border rounded px-3 py-2"
          />

          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="border rounded px-3 py-2"
          />

          <Button
            type="submit"
            disabled={loading}
            className="bg-emerald-500 hover:bg-emerald-600 text-white"
          >
            {loading ? "Registering..." : "Register"}
          </Button>
        </form>
      )}

      {/* STEP 2 GOOGLE VERIFICATION */}
      {isPending && !user && (
        <div className="mt-6 flex flex-col items-center space-y-3">
          <p className="text-gray-700 text-center">
            Step 2: Verify your email with Google
          </p>

          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => alert("Google authentication failed")}
          />
        </div>
      )}

      {/* SUCCESS */}
      {user && (
        <p className="mt-4 text-green-600 text-center font-semibold">
          Signup complete! 🎉
        </p>
      )}
    </div>
  );
};

export default SignupPage;
