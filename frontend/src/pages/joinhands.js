import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const mockDrives = [
  { id: 1, title: "🌳 Parkside Cleanup Drive", location: "Lodhi Garden, New Delhi", date: "2025-10-12", description: "Join us to clean and restore green patches around Lodhi Garden." },
  { id: 2, title: "🏖️ Yamuna Riverbank Cleanup", location: "Yamuna Ghat, Delhi", date: "2025-10-20", description: "Help clear plastic waste along the Yamuna riverbanks." },
  { id: 3, title: "🗑️ Nehru Place Street Drive", location: "Nehru Place, South Delhi", date: "2025-10-25", description: "Corporate volunteers and citizens unite to clean busy streets." },
];

export default function JoinHands() {
  const [activeTab, setActiveTab] = useState("join");
  const [drives, setDrives] = useState(mockDrives);
  const [newDrive, setNewDrive] = useState({ title: "", location: "", date: "", description: "" });

  const handleCreateDrive = () => {
    if (!newDrive.title || !newDrive.location)
      return alert("Please fill all fields!");
    const created = { ...newDrive, id: Date.now() };
    setDrives((prev) => [created, ...prev]);
    setNewDrive({ title: "", location: "", date: "", description: "" });
    alert("✅ Cleanup drive created successfully!");
    setActiveTab("join");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-emerald-100 flex flex-col items-center pt-28 pb-10 text-emerald-800">
      <h1 className="text-4xl font-extrabold text-emerald-700 mb-10 drop-shadow-sm">
        🌍 JoinHands
      </h1>

      {/* Navigation Buttons */}
      <div className="flex flex-wrap justify-center gap-4 mb-8">
        {["join", "start"].map((tab) => (
          <Button
            key={tab}
            variant={activeTab === tab ? "default" : "outline"}
            onClick={() => setActiveTab(tab)}
            className={`px-8 py-2 rounded-full transition-all ${
              activeTab === tab
                ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-md"
                : "border-emerald-500 text-emerald-700 hover:bg-emerald-100 shadow-sm"
            }`}
          >
            {tab === "join" ? "Join a Cleanup Drive" : "Start a Cleanup Drive"}
          </Button>
        ))}
      </div>

      <div className="w-full max-w-lg px-4">
        {activeTab === "join" && (
          <Card className="shadow-lg border border-emerald-500 bg-emerald-50">
            <CardHeader>
              <CardTitle className="text-emerald-700">🤝 Upcoming Drives</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {drives.map((drive) => (
                <div
                  key={drive.id}
                  className="p-4 border border-emerald-300 rounded-lg bg-white hover:border-emerald-500 transition-colors shadow-sm"
                >
                  <h4 className="font-bold text-lg text-emerald-800">{drive.title}</h4>
                  <p className="text-sm font-semibold text-emerald-600 italic">📍 {drive.location}</p>
                  <p className="text-sm text-slate-600 mt-2">{drive.description}</p>
                  <div className="mt-3 flex justify-between items-center">
                    <span className="text-xs font-bold text-emerald-500 uppercase tracking-widest">📅 {drive.date}</span>
                    <Button size="sm" className="bg-emerald-600 text-white hover:bg-emerald-700">Volunteer</Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {activeTab === "start" && (
          <Card className="shadow-lg border border-emerald-500 bg-emerald-50">
            <CardHeader>
              <CardTitle className="text-emerald-700">🧹 Start a Movement</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                placeholder="Drive Title (e.g. Beach Cleanup)"
                value={newDrive.title}
                onChange={(e) => setNewDrive({ ...newDrive, title: e.target.value })}
              />
              <Input
                placeholder="Specific Location / Meeting Point"
                value={newDrive.location}
                onChange={(e) => setNewDrive({ ...newDrive, location: e.target.value })}
              />
              <Input
                type="date"
                value={newDrive.date}
                onChange={(e) => setNewDrive({ ...newDrive, date: e.target.value })}
              />
              <Textarea
                placeholder="What should volunteers bring? (Gloves, Bags, etc.)"
                value={newDrive.description}
                onChange={(e) => setNewDrive({ ...newDrive, description: e.target.value })}
                className="min-h-[100px]"
              />
              <Button
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-6 shadow-lg"
                onClick={handleCreateDrive}
              >
                Launch Drive
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}