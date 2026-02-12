import React, { useState } from 'react';
import { 
  Leaf, 
  AlertCircle, 
  CheckCircle, 
  Users, 
  MapPin, 
  PlusCircle, 
  Calendar,
  Zap
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";

const Dash = ({ user }) => {
  // Local state representing data normally passed from your Create/Join forms
  const [myCreatedDrives] = useState([
    { id: 101, title: "Yamuna Bank Cleanup", date: "2026-02-20", location: "Noida Sector 18", volunteers: 15, status: "Upcoming" },
    { id: 102, title: "Neighborhood Tree Plantation", date: "2026-01-15", location: "Dwarka Path", volunteers: 42, status: "Completed" }
  ]);

  const [joinedCampaigns] = useState([
    { id: 201, title: "Anti-Plastic Awareness", organizer: "GreenPeace India", role: "Volunteer", date: "2026-02-25" },
    { id: 202, title: "Urban Forest Monitoring", organizer: "EcoWatch", role: "Data Collector", date: "2026-03-05" }
  ]);

  // Derived stats from frontend data
  const totalDrivesStarted = myCreatedDrives.length;
  const totalJoined = joinedCampaigns.length;

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-12 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Personalized Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
          <div>
            <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">
              {user?.username ? `${user.username}'s Impact` : "Your Eco Dashboard"}
            </h1>
            <p className="text-slate-500 mt-2 text-lg font-medium">
              You've launched <span className="text-emerald-600 font-bold">{totalDrivesStarted}</span> cleanup movements!
            </p>
          </div>
          <div className="flex gap-3">
            <Button className="bg-emerald-600 hover:bg-emerald-700 shadow-md">
              <PlusCircle className="mr-2 h-4 w-4" /> Start New Drive
            </Button>
          </div>
        </div>

        {/* Impact Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="bg-white border-none shadow-sm border-l-4 border-l-emerald-500">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="bg-emerald-100 p-3 rounded-full">
                <Zap className="h-6 w-6 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500 font-bold uppercase">Drives Started</p>
                <h2 className="text-3xl font-black text-slate-800">{totalDrivesStarted}</h2>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-none shadow-sm border-l-4 border-l-blue-500">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="bg-blue-100 p-3 rounded-full">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500 font-bold uppercase">Campaigns Joined</p>
                <h2 className="text-3xl font-black text-slate-800">{totalJoined}</h2>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-none shadow-sm border-l-4 border-l-amber-500">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="bg-amber-100 p-3 rounded-full">
                <Leaf className="h-6 w-6 text-amber-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500 font-bold uppercase">Community Rank</p>
                <h2 className="text-3xl font-black text-slate-800">Top 5%</h2>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          
          {/* Section: Movements Started By User */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <PlusCircle className="h-5 w-5 text-emerald-600" /> Movements You Started
            </h3>
            <div className="grid gap-4">
              {myCreatedDrives.map((drive) => (
                <Card key={drive.id} className="group hover:border-emerald-300 transition-all shadow-sm border-slate-200 overflow-hidden">
                  <CardContent className="p-0">
                    <div className="flex flex-col sm:flex-row">
                      <div className="bg-emerald-600 text-white p-4 flex flex-col justify-center items-center sm:w-24">
                        <span className="text-xs font-bold uppercase">{drive.date.split('-')[1]}</span>
                        <span className="text-2xl font-black">{drive.date.split('-')[2]}</span>
                      </div>
                      <div className="p-5 flex-grow">
                        <div className="flex justify-between items-start">
                          <h4 className="font-bold text-lg text-slate-800 group-hover:text-emerald-700 transition-colors">{drive.title}</h4>
                          <Badge className={drive.status === 'Upcoming' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'}>
                            {drive.status}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 mt-3 text-sm text-slate-500">
                          <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {drive.location}</span>
                          <span className="flex items-center gap-1"><Users className="h-3 w-3" /> {drive.volunteers} Joined</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Section: Campaigns Joined */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <HandshakeIcon className="h-5 w-5 text-blue-600" /> Campaigns Joined
            </h3>
            <div className="grid gap-4">
              {joinedCampaigns.map((camp) => (
                <Card key={camp.id} className="hover:shadow-md transition-shadow border-slate-200 border-l-4 border-l-blue-400">
                  <CardContent className="p-5">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-bold text-slate-800">{camp.title}</h4>
                      <Badge variant="outline" className="text-blue-600 border-blue-200">{camp.role}</Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <p className="text-slate-500">Organizer: <span className="text-slate-700 font-semibold">{camp.organizer}</span></p>
                      <p className="text-slate-400 flex items-center gap-1"><Calendar className="h-3 w-3" /> {camp.date}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

// Simple helper icon component for Handshake
const HandshakeIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m11 17 2 2 6-6"/><path d="m18 10 1-1a2 2 0 0 0-3-3l-7 7a2 2 0 0 0-6 6c0 1.1.9 2 2 2h3c1.21 0 2.43-.45 3.37-1.31l4.74-4.74"/><path d="m3 18 5-5"/><path d="m5 20 5-5"/></svg>
);

export default Dash;