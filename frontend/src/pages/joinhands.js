import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Search, Calendar as CalendarIcon, MapPin } from "lucide-react";

axios.defaults.withCredentials = true;

export default function JoinHands() {
  const [activeTab, setActiveTab] = useState("join");
  const [drives, setDrives] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Filter States
  const [filterLocation, setFilterLocation] = useState("");
  const [filterDate, setFilterDate] = useState("");

  const [newDrive, setNewDrive] = useState({
    title: "",
    location: "",
    date: "",
    description: "",
  });

  useEffect(() => {
    const fetchDrives = async () => {
      try {
        const response = await axios.get("/cleanup-drive/drives");
        setDrives(response.data);
      } catch (error) {
        console.error("Failed to fetch drives:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDrives();
  }, []);

  // Filter Logic
  const filteredDrives = drives.filter((drive) => {
    const matchesLocation = drive.location.toLowerCase().includes(filterLocation.toLowerCase());
    const matchesDate = filterDate ? drive.date.startsWith(filterDate) : true;
    return matchesLocation && matchesDate;
  });

  const handleCreateDrive = async () => {
    if (!newDrive.title || !newDrive.location || !newDrive.date || !newDrive.description) {
      return alert("Please fill all fields!");
    }
    try {
      const payload = { ...newDrive };
      const response = await axios.post("cleanup-drive/create", payload);

      if (response.status === 201) {
        setDrives((prev) => [response.data, ...prev]);
        setNewDrive({ title: "", location: "", date: "", description: "" });
        alert("✅ Cleanup drive created successfully!");
        setActiveTab("join");
      }
    } catch (error) {
      alert("❌ Failed to create drive.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-emerald-100 flex flex-col items-center pt-28 pb-10 text-emerald-800">
      <div className="max-w-7xl w-full px-6">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-emerald-700 mb-4 drop-shadow-sm">
            🌍 JoinHands
          </h1>
          
          {/* Navigation Buttons */}
          <div className="flex flex-wrap justify-center gap-4">
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
                {tab === "join" ? "Explore Drives" : "Start a Movement"}
              </Button>
            ))}
          </div>
        </div>

        {activeTab === "join" && (
          <div className="space-y-8">
            {/* Filter Bar */}
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-emerald-100 flex flex-wrap gap-4 items-center justify-center">
              <div className="relative flex-grow max-w-sm">
                <Search className="absolute left-3 top-3 h-4 w-4 text-emerald-500" />
                <Input 
                  placeholder="Search by location..." 
                  className="pl-10 border-emerald-100 focus:ring-emerald-500"
                  value={filterLocation}
                  onChange={(e) => setFilterLocation(e.target.value)}
                />
              </div>
              <div className="relative flex-grow max-w-xs">
                <CalendarIcon className="absolute left-3 top-3 h-4 w-4 text-emerald-500" />
                <Input 
                  type="date"
                  className="pl-10 border-emerald-100 focus:ring-emerald-500"
                  value={filterDate}
                  onChange={(e) => setFilterDate(e.target.value)}
                />
              </div>
              {(filterLocation || filterDate) && (
                <Button 
                  variant="ghost" 
                  onClick={() => {setFilterLocation(""); setFilterDate("");}}
                  className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
                >
                  Clear Filters
                </Button>
              )}
            </div>

            {/* Grid Layout */}
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-64 bg-white/50 animate-pulse rounded-2xl border border-emerald-100" />
                ))}
              </div>
            ) : filteredDrives.length === 0 ? (
              <div className="text-center py-20 bg-white/30 rounded-3xl border-2 border-dashed border-emerald-200">
                <p className="text-xl text-emerald-700/60 font-medium">No active drives match your filters.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredDrives.map((drive) => (
                  <Card key={drive._id} className="shadow-md border-emerald-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 bg-white overflow-hidden group">
                    <div className="h-2 bg-emerald-500 w-full" />
                    <CardHeader>
                      <CardTitle className="text-emerald-800 text-xl font-bold truncate">
                        {drive.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center gap-2 text-emerald-600 font-medium text-sm">
                        <MapPin className="h-4 w-4" />
                        <span className="truncate">{drive.location}</span>
                      </div>
                      <p className="text-slate-600 text-sm line-clamp-3 min-h-[60px]">
                        {drive.description}
                      </p>
                      <div className="pt-4 border-t border-emerald-50 flex justify-between items-center">
                        <div className="flex flex-col">
                          <span className="text-[10px] text-slate-400 uppercase font-bold tracking-tighter">Event Date</span>
                          <span className="text-xs font-bold text-emerald-500">
                            📅 {new Date(drive.date).toLocaleDateString()}
                          </span>
                        </div>
                        <Button
                          size="sm"
                          className="bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm px-5"
                          onClick={() => alert(`You joined: ${drive.title}`)}
                        >
                          Volunteer
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "start" && (
          <div className="flex justify-center">
            <Card className="shadow-xl border-emerald-500 bg-white max-w-lg w-full">
              <CardHeader className="bg-emerald-50 border-b border-emerald-100">
                <CardTitle className="text-emerald-700 flex items-center gap-2">
                  🧹 Start a Movement
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 pt-6">
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
          </div>
        )}
      </div>
    </div>
  );
}