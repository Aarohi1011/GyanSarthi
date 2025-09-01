"use client";

import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

export default function TestPage() {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [messages, setMessages] = useState<string[]>([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    // Connect to the backend Socket.IO server
    const newSocket = io("http://localhost:5000");
    setSocket(newSocket);

    // Handle connection
    newSocket.on("connect", () => {
      console.log("Connected to server with ID:", newSocket.id);
      setMessages((prev) => [
        ...prev,
        `✅ Connected! Your ID is ${newSocket.id}`,
      ]);
    });

    // Handle receiving messages
    newSocket.on("receive_message", (data: { message: string }) => {
      console.log("Message received from server:", data);
      setMessages((prev) => [...prev, data.message]);
    });

    // Handle disconnection
    newSocket.on("disconnect", () => {
      console.log("Disconnected from server.");
      setMessages((prev) => [...prev, "❌ Disconnected from server."]);
    });

    // Cleanup when component unmounts
    return () => {
      newSocket.disconnect();
    };
  }, []);

  const sendMessage = () => {
    if (socket && message.trim() !== "") {
      socket.emit("send_message", { message });
      setMessage(""); // clear input
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Socket.IO Backend Tester</h1>
      <div>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
          style={{ marginRight: "1rem" }}
        />
        <button onClick={sendMessage}>Send</button>
      </div>

      <h2>Messages:</h2>
      <ul>
        {messages.map((msg, index) => (
          <li key={index}>{msg}</li>
        ))}
      </ul>
    </div>
  );
}
