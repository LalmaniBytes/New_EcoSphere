import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Badge } from "../components/ui/badge";
import { Alert, AlertDescription } from "../components/ui/alert";
import {
  MapPin,
  Send,
  CheckCircle,
  AlertTriangle,
  Waves,
  TreePine,
  Car,
} from "lucide-react";
import { toast } from "sonner";
import MapComponent from "../components/MapComponent";
import axios from "axios";

const ReportPage = ({ currentLocation, setCurrentLocation }) => {
  const [formData, setFormData] = useState({
    report_type: "",
    description: "",
    severity: "medium",
    location: null,
  });
  const [loading, setLoading] = useState(false);
  const [recentReports, setRecentReports] = useState([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isGeocoding, setIsGeocoding] = useState(false);

  // Report types with icons and descriptions
  const reportTypes = [
    {
      value: "water_log",
      label: "Water Logging",
      icon: <Waves className="h-5 w-5 text-blue-500" />,
      description: "Report areas prone to flooding or waterlogging",
    },
    {
      value: "visibility",
      label: "Visibility Issues",
      icon: <AlertTriangle className="h-5 w-5 text-yellow-500" />,
      description: "Poor visibility due to smog, fog, or pollution",
    },
    {
      value: "tree_fall",
      label: "Tree Fall",
      icon: <TreePine className="h-5 w-5 text-green-600" />,
      description: "Fallen trees or dangerous tree conditions",
    },
    {
      value: "road_block",
      label: "Road Block",
      icon: <Car className="h-5 w-5 text-red-500" />,
      description: "Road blockages or traffic disruptions",
    },
  ];

  const severityOptions = [
    { value: "low", label: "Low", color: "bg-green-100 text-green-800" },
    {
      value: "medium",
      label: "Medium",
      color: "bg-yellow-100 text-yellow-800",
    },
    { value: "high", label: "High", color: "bg-red-100 text-red-800" },
  ];

  // Load recent reports on component mount
  useEffect(() => {
    fetchRecentReports();
  }, []);

  // Set location when currentLocation changes
  useEffect(() => {
    if (currentLocation) {
      setFormData((prev) => ({
        ...prev,
        location: currentLocation,
      }));
    }
  }, [currentLocation]);

  const fetchRecentReports = async () => {
    try {
      const response = await axios.get("/civic-reports");
      setRecentReports(response.data.slice(0, 5)); // Show last 5 reports
    } catch (error) {
      console.error("Error fetching recent reports:", error);
    }
  };

  const handleLocationSelect = async (location) => {
    setIsGeocoding(true); // Start loading
    try {
      const geoUrl = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${location.latitude}&lon=${location.longitude}`;
      const { data } = await axios.get(geoUrl);
      const address =
        data.display_name ||
        `${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)}`;

      const updatedLocation = { ...location, address };

      setFormData((prev) => ({ ...prev, location: updatedLocation }));
      setCurrentLocation(updatedLocation);
    } catch (error) {
      console.error("Error fetching address:", error);
      toast.error("Could not fetch address for the selected location.");
      setFormData((prev) => ({ ...prev, location }));
      setCurrentLocation(location);
    } finally {
      setIsGeocoding(false); // Stop loading, regardless of success or error
    }
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };
  console.log("Form Data:", formData);
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.location) {
      toast.error("Please select a location on the map");
      return;
    }

    if (!formData.report_type) {
      toast.error("Please select a report type");
      return;
    }

    if (!formData.description.trim()) {
      toast.error("Please provide a description");
      return;
    }

    setLoading(true);

    try {
      const reportData = {
        report_type: formData.report_type,
        description: formData.description.trim(),
        severity: formData.severity,
        reporter_id: null,
        location: formData.location,
      };
      console.log("Submitting report:", reportData);
      await axios.post("/civic-reports", reportData);

      // Reset form
      setFormData({
        report_type: "",
        description: "",
        severity: "medium",
        location: formData.location, // Keep location
      });

      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 5000);

      // Refresh recent reports
      fetchRecentReports();

      toast.success(
        "Report submitted successfully! Thank you for helping your community."
      );
    } catch (error) {
      console.error("Error submitting report:", error);
      toast.error("Failed to submit report. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getReportTypeInfo = (type) => {
    return reportTypes.find((rt) => rt.value === type) || {};
  };
  useEffect(() => {
    // Only run if currentLocation is provided and the form doesn't have a location yet
    if (currentLocation && !formData.location) {
      handleLocationSelect(currentLocation);
    }
  }, [currentLocation, formData.location]);
  return (
    <div className="min-h-screen pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Report Environmental Issues
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Help your community by reporting environmental issues,
            infrastructure problems, and safety concerns. Your reports help
            local authorities take timely action.
          </p>
        </div>

        {showSuccess && (
          <Alert className="mb-6 bg-green-50 border-green-200">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-700">
              <strong>Report submitted successfully!</strong> Local authorities
              have been notified and will review your report.
            </AlertDescription>
          </Alert>
        )}

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Report Form */}
          <div className="space-y-6">
            <Card className="report-card">
              <CardHeader>
                <CardTitle className="text-2xl text-gray-800">
                  Submit New Report
                </CardTitle>
                <p className="text-gray-600">
                  Select a location and describe the issue
                </p>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Location Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Location *
                    </label>
                    {formData.location ? (
                      <div className="flex items-center gap-2 p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
                        <MapPin className="h-4 w-4 text-emerald-600" />
                        <span className="text-emerald-700 font-medium">
                          {formData.location.address}
                        </span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            setFormData((prev) => ({ ...prev, location: null }))
                          }
                          className="ml-auto text-emerald-600 hover:bg-emerald-100"
                        >
                          Change
                        </Button>
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500 p-3 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                        Click on the map to select a location
                      </p>
                    )}
                  </div>

                  {/* Report Type */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Issue Type *
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {reportTypes.map((type) => (
                        <div
                          key={type.value}
                          className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                            formData.report_type === type.value
                              ? "border-emerald-500 bg-emerald-50"
                              : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                          }`}
                          onClick={() =>
                            handleInputChange("report_type", type.value)
                          }
                        >
                          <div className="flex items-center gap-3 mb-2">
                            {type.icon}
                            <span className="font-medium">{type.label}</span>
                          </div>
                          <p className="text-sm text-gray-600">
                            {type.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Severity */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Severity Level *
                    </label>
                    <Select
                      value={formData.severity}
                      onValueChange={(value) =>
                        handleInputChange("severity", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {severityOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            <div className="flex items-center gap-2">
                              <Badge className={option.color}>
                                {option.label}
                              </Badge>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description *
                    </label>
                    <Textarea
                      value={formData.description}
                      onChange={(e) =>
                        handleInputChange("description", e.target.value)
                      }
                      placeholder="Describe the issue in detail. Include any relevant information that would help authorities understand and address the problem..."
                      className="min-h-[120px]"
                      maxLength={500}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      {formData.description.length}/500 characters
                    </p>
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    disabled={
                      loading ||
                      !formData.location ||
                      !formData.report_type ||
                      !formData.description.trim()
                    }
                    className="w-full bg-emerald-500 hover:bg-emerald-600 py-6 text-lg font-semibold"
                    data-testid="submit-report-btn"
                  >
                    {loading ? (
                      <div className="spinner mr-2" />
                    ) : (
                      <Send className="mr-2 h-5 w-5" />
                    )}
                    {loading ? "Submitting..." : "Submit Report"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Map and Recent Reports */}
          <div className="space-y-6">
            {/* Map */}
            <Card className="report-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-emerald-600" />
                  Select Location
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80 w-full rounded-lg overflow-hidden">
                  <MapComponent
                    onLocationSelect={handleLocationSelect}
                    selectedLocation={formData.location}
                    currentLocation={currentLocation}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Recent Reports */}
            <Card className="report-card">
              <CardHeader>
                <CardTitle>Recent Community Reports</CardTitle>
                <p className="text-sm text-gray-600">
                  Latest environmental issues reported by community members
                </p>
              </CardHeader>
              <CardContent>
                {recentReports.length > 0 ? (
                  <div className="space-y-3" data-testid="recent-reports-list">
                    {recentReports.map((report, index) => {
                      const typeInfo = getReportTypeInfo(report.report_type);
                      const severityColor =
                        severityOptions.find((s) => s.value === report.severity)
                          ?.color || "bg-gray-100";

                      return (
                        <div
                          key={report.id}
                          className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-2">
                              {typeInfo.icon}
                              <span className="font-medium">
                                {typeInfo.label}
                              </span>
                            </div>
                            <Badge className={severityColor}>
                              {report.severity}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">
                            {report.description.length > 100
                              ? `${report.description.substring(0, 100)}...`
                              : report.description}
                          </p>
                          <div className="flex items-center gap-4 text-xs text-gray-500">
                            <span className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {report.location.address}
                            </span>
                            <span>
                              {new Date(report.timestamp).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-8">
                    No recent reports. Be the first to report an issue in your
                    area!
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportPage;
