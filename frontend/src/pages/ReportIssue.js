import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AlertCircle, CheckCircle2, MapPin, Building2, Loader2 } from "lucide-react";
import axios from "axios";
import { toast } from "sonner"; // Assuming you use sonner for consistency

export default function ReportIssuePage() {
  const [issues, setIssues] = useState([]);
  const [newIssue, setNewIssue] = useState({ 
    title: "", 
    description: "", 
    location: "", // Human readable address
    lat: null,    // For Database
    lng: null,    // For Database
    department: "" 
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [loading, setLoading] = useState(false);

  const departments = [
    "Environmental",
    "Road",
    "Air",
    "Water",
    "Hazardous Waste Management",
    "Others"
  ];

  // 1. AUTO-LOCATION FETCHING ON MOUNT
  useEffect(() => {
    const fetchLocation = async () => {
      if (navigator.geolocation) {
        setIsLocating(true);
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            try {
              const { latitude, longitude } = position.coords;
              // Reverse Geocoding via OpenStreetMap
              const response = await axios.get(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
              );
              const address = response.data.display_name;
              
              setNewIssue(prev => ({ 
                ...prev, 
                location: address,
                lat: latitude,
                lng: longitude
              }));
            } catch (error) {
              console.error("Geocoding error", error);
              toast.error("Location detected but could not fetch address.");
            } finally {
              setIsLocating(false);
            }
          },
          (error) => {
            console.error("Geolocation error", error);
            setIsLocating(false);
            toast.error("Please enable location permissions.");
          }
        );
      }
    };
    fetchLocation();
  }, []);

  // 2. SMART DEPARTMENT SELECTION
  useEffect(() => {
    const title = newIssue.title.toLowerCase();
    let suggestedDept = "";

    if (title.includes("garbage") || title.includes("waste") || title.includes("dump")) {
      suggestedDept = "hazardous waste management";
    } else if (title.includes("pothole") || title.includes("road") || title.includes("street")) {
      suggestedDept = "road";
    } else if (title.includes("smoke") || title.includes("air") || title.includes("smog")) {
      suggestedDept = "air";
    } else if (title.includes("water") || title.includes("leak") || title.includes("logging")) {
      suggestedDept = "water";
    } else if (title.includes("tree") || title.includes("park") || title.includes("pollution")) {
      suggestedDept = "environmental";
    }

    if (suggestedDept && suggestedDept !== newIssue.department) {
      setNewIssue(prev => ({ ...prev, department: suggestedDept }));
    }
  }, [newIssue.title]);

  // 3. POST TO DATABASE
  const handleReportIssue = async () => {
    if (!newIssue.title || !newIssue.description || !newIssue.department) {
      return toast.error("Please fill all required fields!");
    }
    
    setLoading(true);

    try {
      // Prepare the payload for your backend (matching your Database schema)
      const reportData = {
        title: newIssue.title,
        description: newIssue.description,
        department: newIssue.department,
        location_address: newIssue.location,
        latitude: newIssue.lat,
        longitude: newIssue.lng,
        status: "Pending",
        timestamp: new Date().toISOString()
      };

      // REPLACE '/civic-reports' with your actual API endpoint
      const response = await axios.post("/civic-reports", reportData);

      setIssues((prev) => [response.data, ...prev]);
      
      // Reset form but keep the location for next report if needed
      setNewIssue({ 
        title: "", 
        description: "", 
        location: newIssue.location, 
        lat: newIssue.lat, 
        lng: newIssue.lng, 
        department: "" 
      });
      
      setIsSubmitted(true);
      toast.success("Issue reported to database!");
      setTimeout(() => setIsSubmitted(false), 3000);

    } catch (error) {
      console.error("Database submission error:", error);
      toast.error("Failed to save report to server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-emerald-100 pt-28 pb-10 px-4 flex flex-col items-center text-emerald-800">
      <div className="max-w-2xl w-full space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-emerald-700 mb-2 drop-shadow-sm">
            🚨 Report an Issue
          </h1>
          <p className="text-emerald-600 font-medium">Auto-detecting your location for faster response.</p>
        </div>

        {isSubmitted && (
          <div className="bg-emerald-500 text-white p-4 rounded-lg flex items-center gap-3 animate-bounce shadow-lg">
            <CheckCircle2 className="h-6 w-6" />
            <span className="font-bold">Issue logged successfully! Authorities notified.</span>
          </div>
        )}

        <Card className="shadow-xl border border-emerald-500 bg-white">
          <CardHeader className="bg-emerald-50 border-b border-emerald-100">
            <CardTitle className="text-emerald-700 flex items-center gap-2">
              <AlertCircle className="h-5 w-5" /> Submit New Report
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5 pt-6">
            
            {/* Issue Title */}
            <div className="space-y-2">
              <label className="text-sm font-bold ml-1 text-emerald-600 uppercase">What is the issue?</label>
              <Input
                placeholder="e.g. Open Garbage Dump (Smart suggest active...)"
                value={newIssue.title}
                onChange={(e) => setNewIssue({ ...newIssue, title: e.target.value })}
                className="border-emerald-200 focus:ring-emerald-500"
              />
            </div>

            {/* Exact Location */}
            <div className="space-y-2">
              <label className="text-sm font-bold ml-1 text-emerald-600 uppercase flex justify-between">
                Exact Location
                {isLocating && <span className="flex items-center gap-1 text-[10px] animate-pulse"><Loader2 className="h-3 w-3 animate-spin"/> Locating...</span>}
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-4 w-4 text-emerald-400" />
                <Input
                  placeholder="Fetching location..."
                  value={newIssue.location}
                  onChange={(e) => setNewIssue({ ...newIssue, location: e.target.value })}
                  className="pl-10 border-emerald-200 focus:ring-emerald-500"
                />
              </div>
            </div>

            {/* Department Dropdown */}
            <div className="space-y-2">
              <label className="text-sm font-bold ml-1 text-emerald-600 uppercase">Relevant Department</label>
              <Select 
                onValueChange={(value) => setNewIssue({ ...newIssue, department: value })}
                value={newIssue.department}
              >
                <SelectTrigger className={`border-emerald-200 focus:ring-emerald-500 w-full bg-white ${newIssue.department ? 'border-emerald-500 ring-1 ring-emerald-500' : ''}`}>
                    <div className="flex items-center gap-2 text-slate-500">
                        <Building2 className="h-4 w-4 text-emerald-400" />
                        <SelectValue placeholder="Select the department" />
                    </div>
                </SelectTrigger>
                <SelectContent className="bg-white border-emerald-200">
                  {departments.map((dept) => (
                    <SelectItem key={dept} value={dept.toLowerCase()} className="hover:bg-emerald-50 cursor-pointer">
                      {dept}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Details */}
            <div className="space-y-2">
              <label className="text-sm font-bold ml-1 text-emerald-600 uppercase">Details</label>
              <Textarea
                placeholder="Provide a brief description of the severity..."
                value={newIssue.description}
                onChange={(e) => setNewIssue({ ...newIssue, description: e.target.value })}
                className="min-h-[120px] border-emerald-200 focus:ring-emerald-500"
              />
            </div>

            <Button
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-6 text-lg font-black shadow-lg transition-transform active:scale-95"
              onClick={handleReportIssue}
              disabled={loading}
            >
              {loading ? <Loader2 className="animate-spin mr-2" /> : "Post Report"}
            </Button>
          </CardContent>
        </Card>

        {/* Local Feed Section */}
        <div className="space-y-4">
          <h3 className="font-extrabold text-emerald-800 text-xl flex items-center gap-2">
            📍 Recent Community Reports
          </h3>
          {issues.length > 0 ? (
            <div className="grid gap-4">
              {issues.map((issue) => (
                <Card key={issue.id} className="border-l-4 border-l-red-500 shadow-md">
                  <CardContent className="p-4 flex justify-between items-center">
                    <div>
                      <h4 className="font-bold text-lg">{issue.title}</h4>
                      <p className="text-xs text-slate-500">{issue.location_address || issue.location}</p>
                      <Badge variant="outline" className="mt-2 text-emerald-600 border-emerald-600">{issue.department}</Badge>
                    </div>
                    <Badge className="bg-red-100 text-red-700 border-red-200">{issue.status}</Badge>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <p className="text-center text-emerald-600/60 py-10 border-2 border-dashed border-emerald-200 rounded-2xl">
              No reports in this area yet.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}