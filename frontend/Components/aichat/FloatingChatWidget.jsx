"use client";

import { useState, useRef, useEffect } from "react";
import api from "@/lib/api";

export default function FloatingChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isOpen]);

 const sendMessage = async () => {
  if (!inputValue.trim()) return;

  const userMessageText = inputValue;
  setInputValue("");

  setMessages((prev) => [...prev, { id: Date.now(), role: "user", content: userMessageText }]);
  setIsLoading(true);

  try {
    // Համոզվիր, որ այս անունը ճիշտ է՝ ըստ քո լոգինի ֆունկցիայի
    const token = localStorage.getItem("accessToken"); 

    // Եթե տոկեն չկա, մի՛ ուղարկիր, որպեսզի 401 չստանաս
    if (!token) {
      console.warn("No token found");
      setIsLoading(false);
      return;
    }

    const response = await api.post("interact/", {
      message: userMessageText,
      session_id: sessionId
    }, {
      headers: {
        // Համոզվիր, որ 'Bearer' և տոկենի միջև բացատ կա
        "Authorization": `Bearer ${token}`
      }
    });

    const responseData = response.data;
    
    if (!sessionId) {
      setSessionId(responseData.id);
    }

    setMessages(responseData.messages);

  } catch (error) {
  } finally {
    setIsLoading(false);
  }
};

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end font-sans">
      
      <div 
        className={`mb-4 w-80 sm:w-96 h-[500px] bg-white rounded-2xl shadow-2xl border border-gray-100 flex flex-col overflow-hidden transition-all duration-300 transform origin-bottom-right ${
          isOpen ? "scale-100 opacity-100" : "scale-0 opacity-0 pointer-events-none"
        }`}
      >
        <div className="bg-[#1a859c] text-white p-4 flex justify-between items-center shadow-md z-10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-[#1a859c] font-bold text-xl">
              AI
            </div>
            <div>
              <h3 className="font-bold text-sm">Tour Guide</h3>
              <p className="text-xs text-[#e0f2f7]">Online</p>
            </div>
          </div>
          <button onClick={() => setIsOpen(false)} className="text-[#e0f2f7] hover:text-white transition-colors text-xl font-bold">
            ×
          </button>
        </div>

        <div className="flex-1 p-4 overflow-y-auto bg-gray-50 flex flex-col gap-3">
          {messages.length === 0 && (
            <div className="text-center text-gray-400 text-sm mt-10">
              Start a conversation...
            </div>
          )}
          
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              <div 
                className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                  msg.role === "user" 
                    ? "bg-[#1a859c] text-white rounded-br-none" 
                    : "bg-white border border-gray-200 text-gray-800 rounded-bl-none shadow-sm"
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white border border-gray-200 p-4 rounded-2xl rounded-bl-none shadow-sm flex gap-1 items-center">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.4s" }}></div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="p-3 bg-white border-t border-gray-100 flex items-center gap-2">
          <input 
            type="text" 
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message..." 
            disabled={isLoading}
            className="flex-1 p-2 bg-gray-100 border-transparent rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1a859c] text-sm transition-all disabled:opacity-50"
          />
          <button 
            onClick={sendMessage}
            disabled={isLoading || !inputValue.trim()}
            className="bg-[#1a859c] text-white p-2 rounded-xl w-10 h-10 flex justify-center items-center hover:bg-[#136b7d] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
             ➤
          </button>
        </div>
      </div>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-[#1a859c] rounded-full flex items-center justify-center text-white shadow-xl hover:bg-[#136b7d] transition-all transform hover:scale-105 active:scale-95"
        style={{ boxShadow: "0 4px 14px 0 rgba(26, 133, 156, 0.39)" }}
      >
        {isOpen ? (
          <span className="text-2xl font-bold">×</span>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
          </svg>
        )}
      </button>
      
    </div>
  );
}