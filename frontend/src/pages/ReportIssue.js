import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
// Added Select imports
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AlertCircle, CheckCircle2, MapPin, Camera, Building2 } from "lucide-react";

export default function ReportIssuePage() {
  const [issues, setIssues] = useState([]);
  const [newIssue, setNewIssue] = useState({ 
    title: "", 
    description: "", 
    location: "",
    department: "" // New field
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const departments = [
    "Environmental",
    "Road",
    "Air",
    "Water",
    "Hazardous Waste Management",
    "Others"
  ];

  const handleReportIssue = () => {
    if (!newIssue.title || !newIssue.description || !newIssue.department)
      return alert("Please fill all required fields, including the Department!");
    
    const reported = { 
        ...newIssue, 
        id: Date.now(), 
        status: "Pending", 
        date: new Date().toLocaleDateString() 
    };
    
    setIssues((prev) => [reported, ...prev]);
    setNewIssue({ title: "", description: "", location: "", department: "" });
    setIsSubmitted(true);
    setTimeout(() => setIsSubmitted(false), 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-emerald-100 pt-28 pb-10 px-4 flex flex-col items-center text-emerald-800">
      <div className="max-w-2xl w-full space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-emerald-700 mb-2 drop-shadow-sm">
            🚨 Report an Issue
          </h1>
          <p className="text-emerald-600 font-medium">Help us identify environmental or civic concerns in your area.</p>
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
                placeholder="e.g. Open Garbage Dump / Water Logging"
                value={newIssue.title}
                onChange={(e) => setNewIssue({ ...newIssue, title: e.target.value })}
                className="border-emerald-200 focus:ring-emerald-500"
              />
            </div>

            {/* Exact Location */}
            <div className="space-y-2">
              <label className="text-sm font-bold ml-1 text-emerald-600 uppercase">Exact Location</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-4 w-4 text-emerald-400" />
                <Input
                  placeholder="Street name, Landmark, or Area"
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
                <SelectTrigger className="border-emerald-200 focus:ring-emerald-500 w-full bg-white">
                    <div className="flex items-center gap-2 text-slate-500">
                        <Building2 className="h-4 w-4 text-emerald-400" />
                        <SelectValue placeholder="Select the department to notify" />
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

            {/* Photo Evidence */}
            <div className="flex items-center gap-4 p-4 border-2 border-dashed border-emerald-200 rounded-xl bg-emerald-50/30 hover:bg-emerald-50 transition-colors cursor-pointer group">
              <Camera className="h-8 w-8 text-emerald-400 group-hover:text-emerald-600" />
              <div className="text-left">
                <p className="text-sm font-bold text-emerald-700">Upload Photo Evidence</p>
                <p className="text-xs text-emerald-500">Max size 5MB (PNG, JPG)</p>
              </div>
              <input type="file" className="hidden" />
            </div>

            <Button
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-6 text-lg font-black shadow-lg transition-transform active:scale-95"
              onClick={handleReportIssue}
            >
              Post Report
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
                      <div className="flex flex-col gap-1 mt-1">
                        <p className="text-sm text-slate-500 flex items-center gap-1">
                            <MapPin className="h-3 w-3" /> {issue.location || "Location provided"}
                        </p>
                        <p className="text-xs font-bold text-emerald-600 uppercase flex items-center gap-1">
                            <Building2 className="h-3 w-3" /> Dept: {issue.department}
                        </p>
                      </div>
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