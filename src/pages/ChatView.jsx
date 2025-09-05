import React, { useContext, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/apiClient";
import { AuthContext } from "../contexts/AuthContext";
import { useAbly } from "../hooks/useAbly";
import ChatMessage from "../components/ChatMessage";
import MessageInput from "../components/MessageInput";

export default function ChatView() {
  const { id: conversationId } = useParams();
  const { user } = useContext(AuthContext);
  const ably = useAbly();

  const [messages, setMessages] = useState([]);
  const channelRef = useRef(null);
  const scrollRef = useRef();

  // Load history
  useEffect(() => {
    if (!user || !conversationId) return;

    let alive = true;
    (async () => {
      try {
        const res = await api.get(`/messages/${conversationId}`);
        if (!alive) return;
        setMessages(res.data);
      } catch (err) {
        console.error("Error fetching messages:", err);
      }
    })();

    return () => {
      alive = false;
    };
  }, [conversationId, user]);

  // Setup Ably channel
  useEffect(() => {
    if (!ably || !user || !conversationId) return;

    const channel = ably.channels.get(`conversation:${conversationId}`);
    channelRef.current = channel;

    // Listen for new messages
    channel.subscribe("new-message", (msg) => {
      const incoming = msg.data.message || msg.data;

      // Replace optimistic temp message if exists
      setMessages((prev) => {
        const withoutTemp = prev.filter(
          (m) => !(m.pending && m.content === incoming.content)
        );
        return [...withoutTemp, incoming];
      });

      // Auto-scroll
      setTimeout(
        () => scrollRef.current?.scrollIntoView({ behavior: "smooth" }),
        50
      );
    });

    // Typing indicators
    channel.subscribe("typing", (msg) => {
      console.log("typing event:", msg.data);
    });

    // Presence
    channel.presence.enter({
      userId: user._id,
      name: user.username,
    });

    return () => {
      try {
        channel.presence.leave();
        channel.unsubscribe();
        channel.detach();
      } catch (e) {
        console.warn("Error cleaning up Ably channel:", e);
      }
    };
  }, [ably, conversationId, user]);

  // Send message
  const sendMessage = async (text) => {
    if (!text?.trim()) return;

    const tempId = `temp-${Date.now()}`;
    const optimistic = {
      _id: tempId,
      content: text,
      sender: { _id: user._id, username: user.username },
      createdAt: new Date().toISOString(),
      pending: true,
    };
    setMessages((prev) => [...prev, optimistic]);

    try {
      await api.post(`/messages/${conversationId}`, { content: text });
      // ✅ no setMessages here — Ably will deliver the real message
    } catch (err) {
      console.error("Send failed:", err);
      setMessages((prev) =>
        prev.map((m) =>
          m._id === tempId ? { ...m, failed: true, pending: false } : m
        )
      );
    }
  };

  // Send typing event
  const sendTyping = (isTyping) => {
    if (!channelRef.current) return;
    channelRef.current.publish("typing", {
      userId: user._id,
      typing: isTyping,
    });
  };

  return (
    <div className="flex flex-col h-[75vh] bg-white dark:bg-gray-800 rounded shadow overflow-hidden">
      {/* Messages */}
      <div className="flex-1 overflow-auto p-4 space-y-4">
        {messages.map((m) => (
          <div key={m._id || Math.random()} className="flex">
            <ChatMessage
              message={m}
              mine={m.sender?._id === user._id}
              failed={m.failed}
              pending={m.pending}
            />
          </div>
        ))}
        <div ref={scrollRef} />
      </div>

      {/* Input */}
      <div className="border-t p-3 bg-gray-50 dark:bg-gray-900">
        <MessageInput onSend={sendMessage} onTyping={sendTyping} />
      </div>
    </div>
  );
}
