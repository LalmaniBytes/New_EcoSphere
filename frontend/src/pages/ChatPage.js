import React, { useState, useEffect, useRef } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Badge } from "../components/ui/badge";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  MessageCircle,
  Send,
  Bot,
  User,
  Mic,
  MicOff,
  MapPin,
  Lightbulb,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import axios from "axios";

const ChatPage = ({ currentLocation }) => {
  const [messages, setMessages] = useState([
    {
      id: "1",
      type: "ai",
      content:
        "Hello! I'm EcoSphere's environmental AI assistant. I can help you understand air quality, weather conditions, environmental health tips, and answer questions about your local environment. How can I assist you today?",
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState(null);
  const messagesEndRef = useRef(null);

  // Suggested questions
  const suggestedQuestions = [
    "What's the current air quality like?",
    "How can I protect myself from air pollution?",
    "What are the weather conditions today?",
    "Tell me about water logging in my area",
    "What environmental precautions should I take?",
    "How do I report an environmental issue?",
  ];

  // Initialize speech recognition
  useEffect(() => {
    if ("webkitSpeechRecognition" in window) {
      const speechRecognition = new window.webkitSpeechRecognition();
      speechRecognition.continuous = false;
      speechRecognition.interimResults = false;
      speechRecognition.lang = "en-US";

      speechRecognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInputMessage(transcript);
        setIsListening(false);
      };

      speechRecognition.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
        setIsListening(false);
        toast.error("Voice recognition failed. Please try again.");
      };

      speechRecognition.onend = () => {
        setIsListening(false);
      };

      setRecognition(speechRecognition);
    }
  }, []);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (messageText = inputMessage) => {
    if (!messageText.trim()) return;

    const userMessage = {
      id: Date.now().toString(),
      type: "user",
      content: messageText.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setLoading(true);

    try {
      const requestData = {
        message: messageText.trim(),
        location: currentLocation,
      };

      const response = await axios.post("/chat", requestData);

      const aiMessage = {
        id: (Date.now() + 1).toString(),
        type: "ai",
        content: response.data.response,
        suggestions: response.data.suggestions || [],
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error("Error sending message:", error);

      const errorMessage = {
        id: (Date.now() + 1).toString(),
        type: "ai",
        content:
          "I apologize, but I'm experiencing some technical difficulties right now. Please try again in a moment, or feel free to explore the environmental data on the main page.",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, errorMessage]);
      toast.error("Failed to send message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const startListening = () => {
    if (recognition && !isListening) {
      setIsListening(true);
      recognition.start();
    } else {
      toast.error("Voice recognition is not supported in your browser.");
    }
  };

  const stopListening = () => {
    if (recognition && isListening) {
      recognition.stop();
      setIsListening(false);
    }
  };

  const formatTimestamp = (timestamp) => {
    return timestamp.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen pt-20 pb-6">
      <div className="max-w-4xl mx-auto px-4 h-[calc(100vh-7rem)] flex flex-col">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold text-gray-800 mb-2 flex items-center justify-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center">
              <Bot className="h-6 w-6 text-white" />
            </div>
            EcoSphere AI Assistant
          </h1>
          <p className="text-gray-600">
            Ask me anything about environmental conditions, air quality,
            weather, and eco-friendly tips
          </p>
          {currentLocation && (
            <div className="mt-3">
              <Badge className="bg-emerald-100 text-emerald-700">
                <MapPin className="h-3 w-3 mr-1" />
                Location detected:{" "}
                {currentLocation.address ||
                  `${currentLocation.latitude.toFixed(
                    4
                  )}, ${currentLocation.longitude.toFixed(4)}`}
              </Badge>
            </div>
          )}
        </div>

        {/* Chat Container */}
        <Card className="flex-1 flex flex-col report-card">
          {/* Messages Area */}
          <CardContent className="flex-1 p-0 overflow-hidden">
            <div
              className="h-full overflow-y-auto p-6 space-y-4"
              data-testid="chat-messages"
            >
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.type === "user" ? "justify-end" : "justify-start"
                  } animate-fade-in`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl p-4 shadow-sm ${
                      message.type === "user"
                        ? "bg-gradient-to-br from-emerald-500 to-emerald-600 text-white ml-auto"
                        : "bg-white border border-gray-200 text-gray-800"
                    }`}
                  >
                    {/* Message Header */}
                    <div className="flex items-center gap-2 mb-2">
                      {message.type === "user" ? (
                        <User className="h-4 w-4" />
                      ) : (
                        <Bot className="h-4 w-4 text-emerald-600" />
                      )}
                      <span
                        className={`text-sm font-medium ${
                          message.type === "user"
                            ? "text-emerald-100"
                            : "text-gray-600"
                        }`}
                      >
                        {message.type === "user" ? "You" : "EcoSphere AI"}
                      </span>
                      <span
                        className={`text-xs ${
                          message.type === "user"
                            ? "text-emerald-200"
                            : "text-gray-400"
                        }`}
                      >
                        {formatTimestamp(message.timestamp)}
                      </span>
                    </div>

                    {/* Message Content */}
                    <div className="whitespace-pre-wrap">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {message.content}
                      </ReactMarkdown>
                    </div>

                    {/* AI Suggestions */}
                    {message.type === "ai" &&
                      message.suggestions &&
                      message.suggestions.length > 0 && (
                        <div className="mt-3 pt-3 border-t border-gray-200">
                          <p className="text-xs text-gray-500 mb-2 flex items-center gap-1">
                            <Lightbulb className="h-3 w-3" />
                            Quick actions:
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {message.suggestions.map((suggestion, index) => (
                              <Button
                                key={index}
                                variant="outline"
                                size="sm"
                                onClick={() => handleSendMessage(suggestion)}
                                className="text-xs border-emerald-200 hover:bg-emerald-50 hover:border-emerald-300"
                              >
                                {suggestion}
                              </Button>
                            ))}
                          </div>
                        </div>
                      )}
                  </div>
                </div>
              ))}

              {/* Loading indicator */}
              {loading && (
                <div className="flex justify-start animate-fade-in">
                  <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Bot className="h-4 w-4" />
                      <span className="text-sm font-medium">EcoSphere AI</span>
                      <Loader2 className="h-4 w-4 animate-spin" />
                    </div>
                    <div className="mt-2">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div
                          className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                          style={{ animationDelay: "0.1s" }}
                        ></div>
                        <div
                          className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                          style={{ animationDelay: "0.2s" }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          </CardContent>

          {/* Input Area */}
          <div className="border-t border-gray-200 p-4 bg-gray-50">
            {/* Suggested Questions */}
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">Suggested questions:</p>
              <div className="flex flex-wrap gap-2">
                {suggestedQuestions.slice(0, 3).map((question, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => handleSendMessage(question)}
                    className="text-xs border-gray-300 hover:bg-white"
                    data-testid={`suggested-question-${index}`}
                  >
                    {question}
                  </Button>
                ))}
              </div>
            </div>

            {/* Input Row */}
            <div className="flex items-center gap-3">
              <div className="flex-1 relative">
                <Input
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask me about environmental conditions, air quality, weather..."
                  className="pr-12 py-3 text-base"
                  disabled={loading}
                  data-testid="chat-input"
                />

                {/* Voice Input Button */}
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={isListening ? stopListening : startListening}
                  className={`absolute right-2 top-1/2 transform -translate-y-1/2 ${
                    isListening
                      ? "text-red-500 hover:text-red-600"
                      : "text-gray-400 hover:text-gray-600"
                  }`}
                  data-testid="voice-input-btn"
                  disabled={loading}
                >
                  {isListening ? (
                    <MicOff className="h-4 w-4" />
                  ) : (
                    <Mic className="h-4 w-4" />
                  )}
                </Button>
              </div>

              <Button
                onClick={() => handleSendMessage()}
                disabled={loading || !inputMessage.trim()}
                className="bg-emerald-500 hover:bg-emerald-600 px-6 py-3"
                data-testid="send-message-btn"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </div>

            {isListening && (
              <div className="mt-3 text-center">
                <Badge className="bg-red-100 text-red-700">
                  <Mic className="h-3 w-3 mr-1 animate-pulse" />
                  Listening... Speak now
                </Badge>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ChatPage;
