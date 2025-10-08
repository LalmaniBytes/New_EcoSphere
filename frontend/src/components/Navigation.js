import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";
import { GoogleLogin } from "@react-oauth/google";
import { Button } from "./ui/button";
import {
  MapPin,
  MessageCircle,
  FileText,
  LogIn,
  UserPlus,
  Menu,
  X,
} from "lucide-react";

const Navigation = () => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [authMode, setAuthMode] = useState(null); // 'signin' | 'signup' | null
  const [user, setUser] = useState(null);

  const isActive = (path) => location.pathname === path;
  const toggleMobileMenu = () => setMobileMenuOpen((prev) => !prev);

  const handleSignup = async (email, username, password) => {
    await axios.post("/signup", { email, username, password });
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const token = credentialResponse.credential;
      const profile = JSON.parse(atob(token.split(".")[1])); // decode email
      const email = profile.email;

      const { data } = await axios.post(
        "/signin",
        { email, token },
        { withCredentials: true }
      );
      setUser(data.user);
      setAuthMode(null);
      alert("Welcome " + data.user.username);
    } catch (err) {
      console.error(err);
      alert("Login failed");
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-lg border-b border-emerald-100 shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center space-x-2 font-bold text-xl"
          >
            <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-sm">🌍</span>
            </div>
            <span className="gradient-text">EcoSphere</span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-1">
            {[
              { to: "/", label: "Home", icon: <MapPin className="h-4 w-4" /> },
              {
                to: "/report",
                label: "Report Issue",
                icon: <FileText className="h-4 w-4" />,
              },
              {
                to: "/chat",
                label: "AI Assistant",
                icon: <MessageCircle className="h-4 w-4" />,
              },
            ].map(({ to, label, icon }) => (
              <Link key={to} to={to}>
                <Button
                  variant={isActive(to) ? "default" : "ghost"}
                  className={`flex items-center space-x-2 ${
                    isActive(to)
                      ? "bg-emerald-500 hover:bg-emerald-600"
                      : "hover:bg-emerald-50"
                  }`}
                >
                  {icon}
                  <span>{label}</span>
                </Button>
              </Link>
            ))}
          </div>

          {/* Auth Buttons */}
          <div className="flex items-center space-x-2">
            {!user ? (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  className="hidden sm:flex items-center space-x-2 border-emerald-200 hover:bg-emerald-50"
                  onClick={() => setAuthMode("signin")}
                >
                  <LogIn className="h-4 w-4" />
                  <span>Login</span>
                </Button>

                <Button
                  size="sm"
                  className="hidden sm:flex items-center space-x-2 bg-emerald-500 hover:bg-emerald-600"
                  onClick={() => setAuthMode("signup")}
                >
                  <UserPlus className="h-4 w-4" />
                  <span>Sign Up</span>
                </Button>
              </>
            ) : (
              <div className="flex items-center space-x-2">
                <span className="text-emerald-600 font-semibold">
                  {user.username}
                </span>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    axios.post("/signin/logout");
                    setUser(null);
                  }}
                >
                  Logout
                </Button>
              </div>
            )}

            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={toggleMobileMenu}
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Google OAuth Popup */}
        {authMode && (
          <div className="absolute right-4 top-16 bg-white shadow-xl rounded-xl p-4 border border-emerald-100">
            <div className="flex flex-col items-center space-y-3">
              <h3 className="font-semibold text-gray-700">
                {authMode === "signin" ? "Sign In" : "Sign Up"} with Google
              </h3>
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => alert("Google Auth Failed")}
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setAuthMode(null)}
                className="text-gray-500"
              >
                Cancel
              </Button>
            </div>
          </div>
        )}

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-2 flex flex-col space-y-1 pb-2">
            {[
              { to: "/", label: "Home", icon: <MapPin className="h-4 w-4" /> },
              {
                to: "/report",
                label: "Report Issue",
                icon: <FileText className="h-4 w-4" />,
              },
              {
                to: "/chat",
                label: "AI Assistant",
                icon: <MessageCircle className="h-4 w-4" />,
              },
            ].map(({ to, label, icon }) => (
              <Link key={to} to={to} onClick={() => setMobileMenuOpen(false)}>
                <Button
                  variant={isActive(to) ? "default" : "ghost"}
                  className={`w-full flex items-center space-x-2 ${
                    isActive(to)
                      ? "bg-emerald-500 hover:bg-emerald-600"
                      : "hover:bg-emerald-50"
                  }`}
                >
                  {icon}
                  <span>{label}</span>
                </Button>
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
