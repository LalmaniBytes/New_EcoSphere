  import React, { useState } from "react";
  import { useNavigate } from "react-router-dom";
  import axios from "axios";
  import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
  import { Button } from "../components/ui/button";
  import { Input } from "../components/ui/input";
  import { Lock, User } from "lucide-react";

  const AdminLogin = () => {
    const [credentials, setCredentials] = useState({ email: "", password: "" });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
      e.preventDefault();
      setLoading(true);
      try {
        const { data } = await axios.post("/admin/login", credentials, { withCredentials: true });
        if (data.success) {
          alert("Admin Access Granted");
          navigate("/admin"); // Redirect to the admin dashboard
        }
      } catch (err) {
        alert(err.response?.data?.message || "Invalid Admin Credentials");
      } finally {
        setLoading(false);
      }
    };

    return (
      <div className="min-h-screen flex items-center justify-center bg-emerald-50 px-4">
        <Card className="w-full max-w-md shadow-2xl border-emerald-200">
          <CardHeader className="text-center bg-emerald-600 text-white rounded-t-lg">
            <CardTitle className="text-2xl font-bold flex justify-center items-center gap-2">
              <Lock className="h-6 w-6" /> Admin Portal
            </CardTitle>
            <p className="text-emerald-100 text-sm">Secure access for EcoSphere officials</p>
          </CardHeader>
          <CardContent className="pt-8">
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 ml-1">Admin email</label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-emerald-500" />
                  <Input
                    required
                    placeholder="Enter admin ID"
                    className="pl-10"
                    onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 ml-1">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-emerald-500" />
                  <Input
                    required
                    type="password"
                    placeholder="••••••••"
                    className="pl-10"
                    onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                  />
                </div>
              </div>
              <Button type="submit" disabled={loading} className="w-full bg-emerald-600 hover:bg-emerald-700 py-6">
                {loading ? "Verifying..." : "Login to Dashboard"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  };

  export default AdminLogin;