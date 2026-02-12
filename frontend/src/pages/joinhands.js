import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Search, Calendar as CalendarIcon, MapPin, Award, Users, Flame, Trophy, Star, Leaf, Tag, Lock } from 'lucide-react';
import { Progress } from '../components/ui/progress';

axios.defaults.withCredentials = true;

// --- Sub-Components (Integrated from your provided code) ---

const DriveCard = ({ drive, onJoin }) => {
  const [isJoining, setIsJoining] = useState(false);
  const handleJoin = async () => {
    setIsJoining(true);
    await onJoin(drive._id); // Using _id for backend consistency
    setIsJoining(false);
  };

  const available = drive.available_spots ?? 10; // Fallback if not in DB
  const total = drive.total_spots ?? 20;
  const spotsPercentage = (available / total) * 100;
  const spotsColor = spotsPercentage > 50 ? 'text-green-600' : spotsPercentage > 20 ? 'text-orange-600' : 'text-red-600';

  return (
    <div className="relative overflow-hidden bg-white rounded-2xl border border-green-100 shadow-md hover:shadow-xl transition-all duration-300 group">
      <div className="flex flex-col md:flex-row">
        <div className="relative w-full md:w-48 h-48 md:h-auto overflow-hidden">
          <img src={drive.image_url || "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&q=80"} alt={drive.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
          <div className="absolute top-3 right-3 bg-yellow-100 text-yellow-800 border-2 border-yellow-300 px-3 py-1.5 rounded-full font-bold text-xs flex items-center gap-1 shadow-md">
            <Award className="w-4 h-4" /> Earn {drive.points || 50} pts
          </div>
        </div>
        <div className="flex-1 p-6">
          <div className="flex flex-col h-full">
            <div className="mb-4">
              <h3 className="text-2xl font-semibold text-gray-900 mb-2 group-hover:text-[#2E7D32] transition-colors">{drive.title}</h3>
              <div className="flex items-center gap-2 text-gray-600"><MapPin className="w-4 h-4" /><span className="text-sm">{drive.location}</span></div>
            </div>
            <p className="text-gray-600 text-sm mb-4 line-clamp-2">{drive.description}</p>
            <div className="flex flex-wrap items-center gap-4 mb-4">
              <div className="flex items-center gap-2 bg-orange-50 px-3 py-1.5 rounded-full border border-orange-200">
                <Users className="w-4 h-4 text-orange-600" />
                <span className={`text-sm font-semibold ${spotsColor}`}>{available} spots left</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <CalendarIcon className="w-4 h-4" />
                <span className="text-sm">{new Date(drive.date).toLocaleDateString()}</span>
              </div>
            </div>
            <div className="mt-auto">
              <button onClick={handleJoin} disabled={isJoining || available === 0}
                className={`w-full md:w-auto ${available === 0 ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-[#2E7D32] hover:bg-[#1B5E20] text-white hover:-translate-y-0.5'} rounded-full px-8 py-3 font-semibold shadow-md transition-all`}>
                {isJoining ? 'Joining...' : available === 0 ? 'Fully Booked' : 'Join Drive'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Main Page Component ---

export default function JoinHands() {
  const [activeTab, setActiveTab] = useState("join");
  const [drives, setDrives] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterLocation, setFilterLocation] = useState("");
  const [filterDate, setFilterDate] = useState("");

  // Mock User Stats for Gamification (Replace with real user data if available)
  const userStats = {
    points: 1250,
    level: 'Neighborhood Hero',
    streak: 5,
    progress_to_next: 65,
    rank: 12,
    location: 'Delhi'
  };

  const rewards = [
    { id: 1, name: 'Eco-Friendly Bottle', points_cost: 500, icon: 'leaf', description: 'Sustainable bamboo water bottle' },
    { id: 2, name: 'Premium Badge', points_cost: 2000, icon: 'star', description: 'Exclusive profile recognition' },
    { id: 3, name: 'Local Store Discount', points_cost: 800, icon: 'tag', description: '20% off at partner eco-stores' }
  ];

  const [newDrive, setNewDrive] = useState({ title: "", location: "", date: "", description: "" });

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

  const handleJoinDrive = async (driveId) => {
    try {
      // Backend Logic for joining a drive
      await axios.post(`/cleanup-drive/join/${driveId}`);
      alert("✅ Successfully joined the drive! Your points will be credited after completion.");
      // Refresh drives list to update spots
      const response = await axios.get("/cleanup-drive/drives");
      setDrives(response.data);
    } catch (error) {
      alert("❌ Failed to join drive. Ensure you are logged in.");
    }
  };

  const handleCreateDrive = async () => {
    if (!newDrive.title || !newDrive.location || !newDrive.date || !newDrive.description) {
      return alert("Please fill all fields!");
    }
    try {
      const response = await axios.post("cleanup-drive/create", newDrive);
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

  const filteredDrives = drives.filter((drive) => {
    const matchesLocation = drive.location.toLowerCase().includes(filterLocation.toLowerCase());
    const matchesDate = filterDate ? drive.date.startsWith(filterDate) : true;
    return matchesLocation && matchesDate;
  });

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-black text-[#2E7D32] mb-4 tracking-tight">EcoSphere JoinHands</h1>
          <p className="text-gray-600 text-lg">Earn rewards while protecting your environment.</p>
          
          <div className="flex justify-center gap-4 mt-8">
            <Button onClick={() => setActiveTab("join")} variant={activeTab === "join" ? "default" : "outline"} className={`rounded-full px-8 ${activeTab === "join" ? "bg-[#2E7D32]" : ""}`}>
              Explore Drives
            </Button>
            <Button onClick={() => setActiveTab("start")} variant={activeTab === "start" ? "default" : "outline"} className={`rounded-full px-8 ${activeTab === "start" ? "bg-[#2E7D32]" : ""}`}>
              Start a Movement
            </Button>
          </div>
        </div>

        {activeTab === "join" && (
          <div className="space-y-12 animate-in fade-in duration-500">
            
            {/* Gamification Dashboard */}
            <div className="bg-white rounded-3xl border border-green-100 shadow-sm p-2">
               <div className="bg-yellow-50 border-2 border-yellow-200 rounded-2xl p-4 mb-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🎁</span>
                  <span className="font-bold text-yellow-800">Daily Bonus +50 pts available!</span>
                </div>
                <Button className="bg-yellow-400 hover:bg-yellow-500 text-yellow-900 rounded-full">Claim</Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 p-4">
                <div className="md:col-span-8 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                  <div className="flex justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <Trophy className="w-10 h-10 text-yellow-500" />
                      <div>
                        <p className="text-2xl font-bold text-[#2E7D32]">{userStats.points.toLocaleString()} pts</p>
                        <p className="text-sm font-semibold text-slate-500">🟡 {userStats.level}</p>
                      </div>
                    </div>
                    <div className="bg-orange-50 px-4 py-2 rounded-xl border border-orange-100 flex items-center gap-2">
                      <Flame className="text-orange-500" />
                      <span className="font-bold text-orange-600">{userStats.streak} Day Streak</span>
                    </div>
                  </div>
                  <Progress value={userStats.progress_to_next} className="h-3 bg-green-50" />
                  <p className="text-xs text-slate-400 mt-2">65% progress to Green Warrior level</p>
                </div>
                <div className="md:col-span-4 bg-[#2E7D32] p-6 rounded-2xl text-white flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold mb-1">Global Rank</h3>
                    <p className="text-4xl font-black">#{userStats.rank}</p>
                  </div>
                  <Button className="bg-white text-[#2E7D32] hover:bg-slate-100 rounded-full w-full mt-4 font-bold">Leaderboard</Button>
                </div>
              </div>
            </div>

            {/* Filter & Search Bar */}
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-emerald-100 flex flex-wrap gap-4">
              <div className="relative flex-grow max-w-sm">
                <Search className="absolute left-3 top-3 h-4 w-4 text-emerald-500" />
                <Input placeholder="Search location..." className="pl-10 rounded-xl" value={filterLocation} onChange={(e) => setFilterLocation(e.target.value)} />
              </div>
              <div className="relative w-48">
                <CalendarIcon className="absolute left-3 top-3 h-4 w-4 text-emerald-500" />
                <Input type="date" className="pl-10 rounded-xl" value={filterDate} onChange={(e) => setFilterDate(e.target.value)} />
              </div>
            </div>

            {/* Drives List */}
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-[#2E7D32]">Available Cleanup Drives</h2>
              {loading ? (
                <div className="space-y-4">
                  {[1, 2].map(i => <div key={i} className="h-40 bg-white animate-pulse rounded-2xl" />)}
                </div>
              ) : (
                <div className="flex flex-col gap-6">
                  {filteredDrives.map((drive) => (
                    <DriveCard key={drive._id} drive={drive} onJoin={handleJoinDrive} />
                  ))}
                </div>
              )}
            </div>

            {/* Rewards Section */}
            <div className="pt-12 border-t border-slate-200">
               <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-[#2E7D32]">Redeem Points</h2>
                <p className="text-slate-500">Exchange your hard-earned points for eco-rewards.</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {rewards.map((reward) => (
                  <div key={reward.id} className="bg-white rounded-2xl border-2 p-6 border-slate-100 shadow-sm hover:shadow-md transition-all">
                    <div className="flex flex-col items-center text-center">
                      <div className="bg-green-50 p-4 rounded-full mb-4 text-[#2E7D32]">
                         {reward.icon === 'leaf' && <Leaf />}
                         {reward.icon === 'star' && <Star />}
                         {reward.icon === 'tag' && <Tag />}
                      </div>
                      <h3 className="font-bold text-lg mb-1">{reward.name}</h3>
                      <p className="text-sm text-slate-500 mb-4">{reward.description}</p>
                      <Button className="w-full bg-[#2E7D32] rounded-full">{reward.points_cost} pts - Redeem</Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "start" && (
          <div className="flex justify-center animate-in slide-in-from-bottom-4 duration-500">
            <Card className="shadow-2xl border-none bg-white max-w-lg w-full rounded-3xl overflow-hidden">
              <CardHeader className="bg-[#2E7D32] text-white p-8">
                <CardTitle className="text-3xl font-bold flex items-center gap-2">
                  🧹 Start a Movement
                </CardTitle>
                <p className="opacity-90">Organize a cleanup drive and rally your neighbors.</p>
              </CardHeader>
              <CardContent className="p-8 space-y-4">
                <Input placeholder="Drive Title" value={newDrive.title} onChange={(e) => setNewDrive({ ...newDrive, title: e.target.value })} />
                <Input placeholder="Location" value={newDrive.location} onChange={(e) => setNewDrive({ ...newDrive, location: e.target.value })} />
                <Input type="date" value={newDrive.date} onChange={(e) => setNewDrive({ ...newDrive, date: e.target.value })} />
                <Textarea placeholder="Instructions for volunteers..." className="min-h-[120px]" value={newDrive.description} onChange={(e) => setNewDrive({ ...newDrive, description: e.target.value })} />
                <Button className="w-full bg-[#2E7D32] hover:bg-[#1B5E20] py-6 text-lg font-bold rounded-2xl" onClick={handleCreateDrive}>
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