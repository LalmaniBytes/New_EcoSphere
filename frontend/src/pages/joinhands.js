import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function JoinHands() {
  const [activeTab, setActiveTab] = useState("report");

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-emerald-100 flex flex-col items-center pt-28 pb-10 text-emerald-800">
      <h1 className="text-4xl font-extrabold text-emerald-700 mb-10 drop-shadow-sm">
        🌍 JoinHands
      </h1>

      {/* Buttons */}
      <div className="flex flex-wrap justify-center gap-4 mb-8">
        <Button
          variant={activeTab === "report" ? "default" : "outline"}
          onClick={() => setActiveTab("report")}
          className={`${
            activeTab === "report"
              ? "bg-emerald-600 hover:bg-emerald-700 text-white"
              : "border-emerald-500 text-emerald-700 hover:bg-emerald-100"
          }`}
        >
          Report an Issue
        </Button>
        <Button
          variant={activeTab === "join" ? "default" : "outline"}
          onClick={() => setActiveTab("join")}
          className={`${
            activeTab === "join"
              ? "bg-emerald-600 hover:bg-emerald-700 text-white"
              : "border-emerald-500 text-emerald-700 hover:bg-emerald-100"
          }`}
        >
          Join a Cleanup Drive
        </Button>
        <Button
          variant={activeTab === "start" ? "default" : "outline"}
          onClick={() => setActiveTab("start")}
          className={`${
            activeTab === "start"
              ? "bg-emerald-600 hover:bg-emerald-700 text-white"
              : "border-emerald-500 text-emerald-700 hover:bg-emerald-100"
          }`}
        >
          Start a Cleanup Drive
        </Button>
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
                className="border-emerald-400 focus:ring-emerald-500 focus:border-emerald-500"
              />
              <Textarea
                placeholder="Describe the issue in detail..."
                className="border-emerald-400 focus:ring-emerald-500 focus:border-emerald-500"
              />
              <Input
                type="file"
                className="border-emerald-400 focus:ring-emerald-500 focus:border-emerald-500"
              />
              <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white">
                Submit Issue
              </Button>
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
              <Input
                placeholder="Enter your name"
                className="border-emerald-400 focus:ring-emerald-500 focus:border-emerald-500"
              />
              <Input
                placeholder="Preferred Area / City"
                className="border-emerald-400 focus:ring-emerald-500 focus:border-emerald-500"
              />
              <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white">
                Find & Join Drives
              </Button>
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
                className="border-emerald-400 focus:ring-emerald-500 focus:border-emerald-500"
              />
              <Input
                placeholder="Location / Area"
                className="border-emerald-400 focus:ring-emerald-500 focus:border-emerald-500"
              />
              <Input
                type="date"
                className="border-emerald-400 focus:ring-emerald-500 focus:border-emerald-500"
              />
              <Textarea
                placeholder="Describe your drive, timings, and what to bring..."
                className="border-emerald-400 focus:ring-emerald-500 focus:border-emerald-500"
              />
              <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white">
                Create Drive
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
