import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

// Mock cleanup drive data
const mockDrives = [
  {
    id: 1,
    title: "🌳 Parkside Cleanup Drive",
    location: "Lodhi Garden, New Delhi",
    date: "2025-10-12",
    description:
      "Join us to clean and restore green patches around Lodhi Garden.",
  },
  {
    id: 2,
    title: "🏖️ Yamuna Riverbank Cleanup",
    location: "Yamuna Ghat, Delhi",
    date: "2025-10-20",
    description: "Help clear plastic waste along the Yamuna riverbanks.",
  },
  {
    id: 3,
    title: "🗑️ Nehru Place Street Drive",
    location: "Nehru Place, South Delhi",
    date: "2025-10-25",
    description:
      "Corporate volunteers and citizens unite to clean busy streets.",
  },
];

export default function JoinHands() {
  const [activeTab, setActiveTab] = useState("report");
  const [drives, setDrives] = useState(mockDrives);
  const [newDrive, setNewDrive] = useState({
    title: "",
    location: "",
    date: "",
    description: "",
  });
  const [issues, setIssues] = useState([]);
  const [newIssue, setNewIssue] = useState({ title: "", description: "" });

  // Handlers
  const handleCreateDrive = () => {
    if (!newDrive.title || !newDrive.location)
      return alert("Please fill all fields!");
    const created = { ...newDrive, id: Date.now() };
    setDrives((prev) => [...prev, created]);
    setNewDrive({ title: "", location: "", date: "", description: "" });
    alert("✅ Cleanup drive created successfully!");
  };

  const handleReportIssue = () => {
    if (!newIssue.title || !newIssue.description)
      return alert("Please fill all fields!");
    const reported = { ...newIssue, id: Date.now() };
    setIssues((prev) => [...prev, reported]);
    setNewIssue({ title: "", description: "" });
    alert("🚨 Issue reported successfully!");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-emerald-100 flex flex-col items-center pt-28 pb-10 text-emerald-800">
      <h1 className="text-4xl font-extrabold text-emerald-700 mb-10 drop-shadow-sm">
        🌍 JoinHands
      </h1>

      {/* Buttons */}
      <div className="flex flex-wrap justify-center gap-4 mb-8">
        {["report", "join", "start"].map((tab) => (
          <Button
            key={tab}
            variant={activeTab === tab ? "default" : "outline"}
            onClick={() => setActiveTab(tab)}
            className={`${
              activeTab === tab
                ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                : "border-emerald-500 text-emerald-700 hover:bg-emerald-100"
            }`}
          >
            {tab === "report"
              ? "Report an Issue"
              : tab === "join"
              ? "Join a Cleanup Drive"
              : "Start a Cleanup Drive"}
          </Button>
        ))}
      </div>

      {/* Conditional Sections */}
      <div className="w-full max-w-lg">
        {activeTab === "report" && (
          <Card className="shadow-lg border border-emerald-500 bg-emerald-50">
            <CardHeader>
              <CardTitle className="text-emerald-700">
                📍 Report an Issue
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                placeholder="Issue Title (e.g. Water Logging near park)"
                value={newIssue.title}
                onChange={(e) =>
                  setNewIssue({ ...newIssue, title: e.target.value })
                }
              />
              <Textarea
                placeholder="Describe the issue in detail..."
                value={newIssue.description}
                onChange={(e) =>
                  setNewIssue({ ...newIssue, description: e.target.value })
                }
              />
              <Input type="file" />
              <Button
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
                onClick={handleReportIssue}
              >
                Submit Issue
              </Button>

              {issues.length > 0 && (
                <div className="mt-6">
                  <h3 className="font-semibold text-emerald-700 mb-2">
                    📝 Reported Issues:
                  </h3>
                  <ul className="space-y-2">
                    {issues.map((issue) => (
                      <li
                        key={issue.id}
                        className="p-3 border border-emerald-300 rounded-lg bg-emerald-100"
                      >
                        <strong>{issue.title}</strong>
                        <p className="text-sm text-emerald-700">
                          {issue.description}
                        </p>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {activeTab === "join" && (
          <Card className="shadow-lg border border-emerald-500 bg-emerald-50">
            <CardHeader>
              <CardTitle className="text-emerald-700">
                🤝 Join a Cleanup Drive
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input placeholder="Enter your name" />
              <Input placeholder="Preferred Area / City" />
              <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white">
                Find & Join Drives
              </Button>

              <div className="mt-6 space-y-3">
                <h3 className="font-semibold text-emerald-700">
                  🌱 Upcoming Drives:
                </h3>
                {drives.map((drive) => (
                  <div
                    key={drive.id}
                    className="p-4 border border-emerald-300 rounded-lg bg-emerald-100"
                  >
                    <h4 className="font-semibold">{drive.title}</h4>
                    <p className="text-sm">{drive.location}</p>
                    <p className="text-sm text-emerald-700">
                      {drive.description}
                    </p>
                    <p className="text-xs text-emerald-600 mt-1">
                      📅 {drive.date}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === "start" && (
          <Card className="shadow-lg border border-emerald-500 bg-emerald-50">
            <CardHeader>
              <CardTitle className="text-emerald-700">
                🧹 Start a Cleanup Drive
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                placeholder="Drive Title (e.g. Beach Cleanup)"
                value={newDrive.title}
                onChange={(e) =>
                  setNewDrive({ ...newDrive, title: e.target.value })
                }
              />
              <Input
                placeholder="Location / Area"
                value={newDrive.location}
                onChange={(e) =>
                  setNewDrive({ ...newDrive, location: e.target.value })
                }
              />
              <Input
                type="date"
                value={newDrive.date}
                onChange={(e) =>
                  setNewDrive({ ...newDrive, date: e.target.value })
                }
              />
              <Textarea
                placeholder="Describe your drive, timings, and what to bring..."
                value={newDrive.description}
                onChange={(e) =>
                  setNewDrive({ ...newDrive, description: e.target.value })
                }
              />
              <Button
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
                onClick={handleCreateDrive}
              >
                Create Drive
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
