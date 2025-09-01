"use client";

import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

interface Message {
  _id?: string;
  content: string;
  sender: { username: string; _id: string };
  room?: string;
  receiver?: string;
  createdAt?: string;
}

interface User {
  _id: string;
  username: string;
}

export default function Chat() {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState("");
  const [onlineUsers, setOnlineUsers] = useState<User[]>([]);
  const [currentRoom, setCurrentRoom] = useState("General");
  const [privateTarget, setPrivateTarget] = useState<User | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const rooms = ["General", "Tech", "Random"];

  // Simulate login / fetch current user
  useEffect(() => {
    const token = localStorage.getItem("chat-token");
    if (!token) return;

    fetch("http://localhost:5000/api/auth/me", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Unauthorized");
        return res.json();
      })
      .then((data) => {
        setCurrentUser({ _id: data.user._id, username: data.user.username });
      })
      .catch((err) => console.error(err));
  }, []);

  // Socket.IO setup
  useEffect(() => {
    if (!currentUser) return;

    const newSocket = io("http://localhost:5000");

    newSocket.on("connect", () => {
      newSocket.emit("register_socket", currentUser._id);
      newSocket.emit("join_room", "General");
    });

    newSocket.on("online_users", (users: string[]) => {
      setOnlineUsers(
        users
          .filter((id) => id !== currentUser._id)
          .map((id) => ({ _id: id, username: id }))
      );
    });

    newSocket.on("chat_history", (msgs: Message[]) => setMessages(msgs));
    newSocket.on("receive_message", (msg: Message) =>
      setMessages((prev) => [...prev, msg])
    );

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [currentUser]);

  // Join a room
  const joinRoom = (room: string) => {
    if (!socket || !currentUser) return;
    setCurrentRoom(room);
    setPrivateTarget(null);
    setMessages([]);
    socket.emit("join_room", room);
    setIsMobileMenuOpen(false);
  };

  // Start private chat
  const startPrivateChat = (user: User) => {
    if (!socket || !currentUser) return;
    setPrivateTarget(user);
    setCurrentRoom("");
    setMessages([]);
    setIsMobileMenuOpen(false);
  };

  // Send message
  const sendMessage = () => {
    if (!socket || !currentUser || message.trim() === "") return;

    const data: any = {
      senderId: currentUser._id,
      content: message.trim(),
    };

    if (privateTarget) {
      data.receiverId = privateTarget._id;
    } else {
      data.room = currentRoom;
    }

    socket.emit("send_message", data);
    setMessage("");
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-[#03045e] to-[#0077b6] text-white">
      {/* Header */}
      <header className="flex items-center justify-between p-4 bg-[#03045e] border-b border-[#00b4d8]">
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-[#00b4d8] flex items-center justify-center mr-3">
            <span className="font-bold">
              {currentUser?.username?.charAt(0).toUpperCase() || "U"}
            </span>
          </div>
          <h1 className="text-xl font-bold">ChatApp</h1>
        </div>
        <div className="md:hidden">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-lg bg-[#00b4d8] hover:bg-[#90e0ef] transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {isMobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar for desktop and mobile menu */}
        <div
          className={`${
            isMobileMenuOpen ? "flex" : "hidden"
          } md:flex flex-col md:flex-row w-full md:w-auto absolute md:relative z-10 bg-[#03045e] md:bg-transparent h-full md:h-auto`}
        >
          {/* Rooms list */}
          <div className="w-full md:w-64 flex-shrink-0 p-4 bg-[#03045e] md:bg-opacity-90 border-r border-[#00b4d8]">
            <h2 className="text-lg font-semibold mb-4 text-[#90e0ef]">Rooms</h2>
            <ul className="space-y-2">
              {rooms.map((room) => (
                <li
                  key={room}
                  className={`p-3 rounded-lg cursor-pointer transition-all ${
                    room === currentRoom && !privateTarget
                      ? "bg-[#0077b6] text-white shadow-lg"
                      : "bg-[#4080bf] hover:bg-[#538cc6]"
                  }`}
                  onClick={() => joinRoom(room)}
                >
                  <div className="flex items-center">
                    <span className="mr-2">#</span>
                    {room}
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Online Users */}
          <div className="w-full md:w-64 flex-shrink-0 p-4 bg-[#03045e] md:bg-opacity-90 border-r border-[#00b4d8]">
            <h2 className="text-lg font-semibold mb-4 text-[#90e0ef]">
              Online Users
            </h2>
            <ul className="space-y-2">
              {onlineUsers.map((user) => (
                <li
                  key={user._id}
                  className={`p-3 rounded-lg cursor-pointer transition-all ${
                    privateTarget?._id === user._id
                      ? "bg-[#0077b6] text-white shadow-lg"
                      : "bg-[#4080bf] hover:bg-[#538cc6]"
                  }`}
                  onClick={() => startPrivateChat(user)}
                >
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-[#00b4d8] flex items-center justify-center mr-3">
                      <span className="text-xs font-bold">
                        {user.username.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <span>{user.username}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Chat Window */}
        <div className="flex-1 flex flex-col bg-[#caf0f8] bg-opacity-20 backdrop-blur-sm">
          <div className="p-4 bg-[#03045e] bg-opacity-90 border-b border-[#00b4d8]">
            <h2 className="text-xl font-semibold text-[#90e0ef]">
              {privateTarget
                ? `Private Chat with ${privateTarget.username}`
                : `Room: ${currentRoom}`}
            </h2>
          </div>

          <div
            className="flex-1 overflow-y-auto p-4 space-y-4"
            id="chat-messages"
          >
            {messages.length === 0 ? (
              <div className="text-center py-8 text-gray-300">
                <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-[#03045e] bg-opacity-30 flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-12 w-12"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                    />
                  </svg>
                </div>
                <p>No messages yet. Start the conversation!</p>
              </div>
            ) : (
              messages.map((msg) => (
                <div
                  key={msg._id || Math.random()}
                  className={`flex ${
                    msg.sender?._id === currentUser?._id
                      ? "justify-end"
                      : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-xs md:max-w-md lg:max-w-lg rounded-2xl p-4 shadow-md ${
                      msg.sender?._id === currentUser?._id
                        ? "bg-[#0077b6] text-white rounded-br-none"
                        : "bg-[#6699cc] text-white rounded-bl-none"
                    }`}
                  >
                    <div className="font-semibold">
                      {msg.sender?.username || "Unknown"}
                    </div>
                    <div className="my-1">{msg.content}</div>
                    <div className="text-xs opacity-80 text-right">
                      {msg.createdAt
                        ? new Date(msg.createdAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : ""}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Message Input */}
          <div className="p-4 bg-[#03045e] bg-opacity-90 border-t border-[#00b4d8]">
            <div className="flex space-x-2">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 bg-[#caf0f8] bg-opacity-20 text-white rounded-full py-3 px-4 focus:outline-none focus:ring-2 focus:ring-[#00b4d8] placeholder-gray-300"
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              />
              <button
                onClick={sendMessage}
                disabled={!message.trim()}
                className="bg-[#00b4d8] hover:bg-[#90e0ef] text-white rounded-full p-3 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 5l7 7-7 7M5 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}