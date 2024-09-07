import React, { useState, useEffect, useRef } from "react";
import { FaComments, FaPaperPlane } from "react-icons/fa";

const ChatComponent = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const toggleChat = () => setIsOpen(!isOpen);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (inputMessage.trim()) {
      const userMessage = { text: inputMessage, sender: "user" };
      setMessages((prevMessages) => [...prevMessages, userMessage]);
      setInputMessage("");
      setIsLoading(true);

      try {
        const response = await fetch(
          "https://42fe-34-143-198-127.ngrok-free.app/chat",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ prompt: inputMessage }),
          }
        );

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const rawResponse = await response.text();
        console.log("Raw Response:", rawResponse);

        let data;
        try {
          data = JSON.parse(rawResponse);
        } catch (error) {
          console.error("Error parsing JSON:", error);
          throw new Error("Invalid JSON response");
        }

        const botMessage = { text: data.response, sender: "bot" };
        setMessages((prevMessages) => [...prevMessages, botMessage]);
      } catch (error) {
        console.error("Error:", error);
        const errorMessage = {
          text: "Sorry, there was an error processing your request.",
          sender: "bot",
        };
        setMessages((prevMessages) => [...prevMessages, errorMessage]);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="relative">
      {!isOpen && (
        <button
          onClick={toggleChat}
          className="bg-black hover:bg-gray-800 text-white rounded-full p-4 shadow-lg"
        >
          <FaComments size={28} />
        </button>
      )}

      {isOpen && (
        <div className="fixed bottom-4 right-4 w-96 h-[32rem] bg-gray-900 rounded-lg shadow-xl flex flex-col">
          <div className="flex justify-between items-center bg-black p-4 rounded-t-lg">
            <h3 className="text-white font-semibold text-xl">Chat Support</h3>
            <button
              onClick={toggleChat}
              className="text-gray-300 hover:text-white text-2xl"
            >
              &times;
            </button>
          </div>

          <div className="flex-grow p-4 overflow-y-auto">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`mb-3 ${
                  message.sender === "user" ? "text-right" : "text-left"
                }`}
              >
                <span
                  className={`inline-block p-3 rounded-lg ${
                    message.sender === "user"
                      ? "bg-white text-black"
                      : "bg-gray-800 text-white"
                  }`}
                >
                  {message.text}
                </span>
              </div>
            ))}
            {isLoading && (
              <div className="text-left mb-3">
                <span className="inline-block p-3 rounded-lg bg-gray-800 text-white">
                  <span className="typing-animation">...</span>
                </span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={sendMessage} className="p-4 bg-black rounded-b-lg">
            <div className="flex">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Type a message..."
                className="flex-grow px-4 py-3 bg-gray-800 text-white rounded-l-md focus:outline-none text-lg"
              />
              <button
                type="submit"
                className="bg-white hover:bg-gray-200 text-black px-6 rounded-r-md"
                disabled={isLoading}
              >
                <FaPaperPlane size={20} />
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default ChatComponent;
