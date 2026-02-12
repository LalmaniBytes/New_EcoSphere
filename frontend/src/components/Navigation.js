import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";
import { GoogleLogin } from "@react-oauth/google";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";
import {
  MapPin,
  MessageCircle,
  FileText,
  LogIn,
  UserPlus,
  Menu,
  X,
  Handshake,
  ChevronDown,
  ShieldCheck,
  User,
} from "lucide-react";

const Navigation = () => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [authMode, setAuthMode] = useState(null); // 'signin' | 'signup' | null
  const [loginDropdownOpen, setLoginDropdownOpen] = useState(false);
  const [user, setUser] = useState(null);
  console.log("User :", user);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("/auto-login", { withCredentials: true })
      .then((res) => {
        console.log("Auto login reponse : ", res.data);
        setUser(res.data.user);
      })
      .catch((err) => {
        console.log("User not logged in yet");
        console.log("Err ;", err);
      });
  }, []);

  const isActive = (path) => location.pathname === path;
  const toggleMobileMenu = () => setMobileMenuOpen((prev) => !prev);

  const handleSignup = async (email, username, password) => {
    await axios.post("/signup", { email, username, password });
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const token = credentialResponse.credential;
      const profile = JSON.parse(atob(token.split(".")[1]));
      const email = profile.email;

      const endpoint =
        authMode === "signup"
          ? "/signup/google" // FINALIZE signup
          : "/signin"; // normal login

      const { data } = await axios.post(
        endpoint,
        { email },
        { withCredentials: true },
      );

      console.log("data :", data);

      if (data.user) {
        setUser(data.user);
        alert("Welcome " + data.user.username);
      } else if (data.message) {
        alert(data.message);
      }

      setAuthMode(null);
    } catch (err) {
      console.error(err.response?.data || err);
      alert(err.response?.data?.detail || "Authentication failed");
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
            <Link to="/">
              <Button
                variant={isActive("/") ? "default" : "ghost"}
                className={`flex items-center space-x-2 ${
                  isActive("/")
                    ? "bg-emerald-500 hover:bg-emerald-600"
                    : "hover:bg-emerald-50"
                }`}
                data-testid="nav-home-btn"
              >
                <MapPin className="h-4 w-4" />
                <span>Home</span>
              </Button>
            </Link>

            <Link to="/report-issue">
              <Button
                variant={isActive("/report-issue") ? "default" : "ghost"}
                className={`flex items-center space-x-2 ${
                  isActive("/report-issue")
                    ? "bg-emerald-500 hover:bg-emerald-600"
                    : "hover:bg-emerald-50"
                }`}
                data-testid="nav-report-btn"
              >
                <FileText className="h-4 w-4" />
                <span>Report Issue</span>
              </Button>
            </Link>

            <Link to="/joinhands">
              <Button
                variant={isActive("/joinhands") ? "default" : "ghost"}
                className={`flex items-center space-x-2 ${
                  isActive("/joinhands")
                    ? "bg-emerald-500 hover:bg-emerald-600"
                    : "hover:bg-emerald-50"
                }`}
                data-testid="nav-chat-btn"
              >
                <Handshake className="h-4 w-4" />
                <span>Join Hands</span>
              </Button>
            </Link>
            <Link to="/mentalhealth">
              <Button
                variant={isActive("/mentalhealth") ? "default" : "ghost"}
                className={`flex items-center space-x-2 ${
                  isActive("/mentalhealth")
                    ? "bg-emerald-500 hover:bg-emerald-600"
                    : "hover:bg-emerald-50"
                }`}
                data-testid="nav-mentalhealth-btn"
              >
                <span>🎶Vibe Cure</span>
              </Button>
            </Link>
            <Link to="/comparison">
              <Button
                variant="ghost"
                className="flex items-center space-x-2 px-4 py-2 rounded-md text-emerald-700 bg-white hover:bg-emerald-50 hover:text-emerald-800 transition-colors duration-200"
                data-testid="nav-mentalhealth-btn"
              >
                <span>Compare</span>
              </Button>
            </Link>
          </div>

          {/* Auth Buttons */}
          <div className="flex items-center space-x-2">
            {!user ? (
              <>
                {/* LOGIN DROPDOWN CONTAINER */}
                <div className="relative hidden sm:block">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center space-x-2 border-emerald-200 hover:bg-emerald-50"
                    onClick={() => setLoginDropdownOpen(!loginDropdownOpen)}
                  >
                    <LogIn className="h-4 w-4" />
                    <span>Login</span>
                    <ChevronDown className={`h-3 w-3 transition-transform ${loginDropdownOpen ? 'rotate-180' : ''}`} />
                  </Button>

                  {loginDropdownOpen && (
                    <div 
                      className="absolute right-0 mt-2 w-48 bg-white border border-emerald-100 rounded-lg shadow-xl py-2 z-[60]"
                      onMouseLeave={() => setLoginDropdownOpen(false)}
                    >
                      <button
                        onClick={() => { setAuthMode("signin"); setLoginDropdownOpen(false); }}
                        className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
                      >
                        <User className="h-4 w-4" />
                        <span>Citizen Login</span>
                      </button>
                      
                      <div className="border-t border-gray-100 my-1"></div>
                      
                      <Link
                        to="/admin-login"
                        onClick={() => setLoginDropdownOpen(false)}
                        className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
                      >
                        <ShieldCheck className="h-4 w-4 text-emerald-600" />
                        <span className="font-medium text-emerald-800">Admin Login</span>
                      </Link>
                    </div>
                  )}
                </div>

                <Button
                  size="sm"
                  className="hidden sm:flex items-center space-x-2 bg-emerald-500 hover:bg-emerald-600"
                >
                  <UserPlus className="h-4 w-4" />
                  <span>
                    <Link to="/signup">Sign Up</Link>
                  </span>
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
                  onClick={async () => {
                    try {
                      const dltData = await axios.post("/signin/logout", {} , {
                        withCredentials: true,
                      });
                      console.log("dlt data: ", dltData);
                      setUser(null);
                      navigate("/");
                      alert("Logout Successful !");
                    } catch (err) {
                      console.log("logout failed :", err);
                    }
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
                to: "/report-issue",
                label: "Report Issue",
                icon: <FileText className="h-4 w-4" />,
              },
              {
                to: "/joinhands",
                label: "Join Hands",
                icon: <Handshake className="h-4 w-4" />,
              },
              {
                to: "/mentalhealth",
                label: "🎶Vibe Cure",
                icon: null,
              },
              {
                to: "/comparison",
                label: "Compare",
                icon: null,
              },
              {
                to: "/admin-login",
                label: "Admin Portal",
                icon: <ShieldCheck className="h-4 w-4" />,
              },
            ].map(({ to, label, icon }) => (
              <Link key={to} to={to} onClick={() => setMobileMenuOpen(false)}>
                <Button
                  variant={isActive(to) ? "default" : "ghost"}
                  className={`w-full justify-start flex items-center space-x-2 ${
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