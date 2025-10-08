import React, { useState } from "react";
import ChatPage from "./ChatPage";
import { MessageCircle, X } from "lucide-react";

const ChatWidget = ({ currentLocation }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleChat = () => setIsOpen((prev) => !prev);

  return (
    <>
      {/* Floating Button when chat is closed */}
      {!isOpen && (
        <button
          onClick={toggleChat}
          style={{
            position: "fixed",
            bottom: "20px",
            right: "20px",
            width: "60px",
            height: "60px",
            borderRadius: "50%",
            backgroundColor: "#10B891",
            color: "white",
            fontSize: "28px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 4px 8px rgba(0,0,0,0.3)",
            zIndex: 1000,
            border: "none",
            cursor: "pointer",
          }}
        >
          <MessageCircle />
        </button>
      )}

      {/* Centered Chat Window */}
      {isOpen && (
        <div
          style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "600px",
            height: "700px",
            backgroundColor: "white",
            borderRadius: "12px",
            boxShadow: "0 8px 24px rgba(0,0,0,0.3)",
            overflow: "hidden",
            zIndex: 1000,
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Relative container for sticky close button */}
          <div style={{ position: "relative", flex: 1, display: "flex", flexDirection: "column" }}>
            {/* Sticky Close button */}
            <button
              onClick={toggleChat}
              style={{
                position: "sticky",
                top: "10px",
                right: "10px",
                alignSelf: "flex-end",
                background: "transparent",
                border: "none",
                cursor: "pointer",
                zIndex: 1001,
                margin: "10px",
              }}
            >
              <X size={24} />
            </button>

            {/* Chat content fills remaining space */}
            <div style={{ flex: 1, overflow: "hidden" }}>
              <ChatPage currentLocation={currentLocation} />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatWidget;
