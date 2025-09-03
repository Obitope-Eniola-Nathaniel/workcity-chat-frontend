import React, { useContext, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/apiClient";
import { AuthContext } from "../contexts/AuthContext";
import { getRealtime } from "../ably/ablyClient";
import ChatMessage from "../components/ChatMessage";
import MessageInput from "../components/MessageInput";

export default function ChatView() {
  const { id: conversationId } = useParams();
  const { user } = useContext(AuthContext);
  const [messages, setMessages] = useState([]);
  const [realtime, setRealtime] = useState(null);
  const channelRef = useRef(null);
  const scrollRef = useRef();

  useEffect(() => {
    if (!user || !conversationId) return;

    let alive = true;

    // load messages
    (async () => {
      try {
        const res = await api.get(`/messages/${conversationId}`);
        if (!alive) return;
        setMessages(res.data);
      } catch (err) {
        console.error(err);
      }
    })();

    // connect to Ably
    (async () => {
      try {
        const ablyRealtime = await getRealtime();
        setRealtime(ablyRealtime);
        const channel = ablyRealtime.channels.get(`chat:${conversationId}`);
        channelRef.current = channel;

        channel.subscribe("new-message", (msg) => {
          const incoming = msg.data.message || msg.data;
          setMessages((prev) => [...prev, incoming]);
          // scroll to bottom
          setTimeout(
            () => scrollRef.current?.scrollIntoView({ behavior: "smooth" }),
            50
          );
        });

        channel.subscribe("typing", (msg) => {
          // handle typing indicator (expand as needed)
          // console.log("typing", msg.data);
        });

        // presence enter
        await channel.presence.enter({ userId: user.id, name: user.name });

        // cleanup on unmount
        // (the return below won't capture inside this IIFE; we use alive flag)
      } catch (err) {
        console.error("Ably error", err);
      }
    })();

    return () => {
      alive = false;
      try {
        if (channelRef.current) {
          channelRef.current.presence.leave();
          channelRef.current.unsubscribe();
        }
        if (realtime) realtime.close();
      } catch (e) {}
    };
  }, [conversationId, user]);

  const sendMessage = async (text) => {
    if (!text?.trim()) return;
    // optimistic UI
    const temp = {
      _id: `temp-${Date.now()}`,
      content: text,
      sender: { _id: user.id, name: user.name },
      createdAt: new Date(),
    };
    setMessages((prev) => [...prev, temp]);

    try {
      await api.post(`/api/messages/${conversationId}`, { content: text });
    } catch (err) {
      console.error("send failed", err);
      // optionally mark failed
    }
  };

  const sendTyping = (isTyping) => {
    if (!channelRef.current) return;
    channelRef.current.publish("typing", { userId: user.id, typing: isTyping });
  };

  return (
    <div className="flex flex-col h-[75vh] bg-white dark:bg-gray-800 rounded shadow overflow-hidden">
      <div className="flex-1 overflow-auto p-4 space-y-4">
        {messages.map((m) => (
          <div key={m._id || Math.random()} className="flex">
            <ChatMessage message={m} mine={m.sender?._id === user.id} />
          </div>
        ))}
        <div ref={scrollRef} />
      </div>

      <div className="border-t p-3 bg-gray-50 dark:bg-gray-900">
        <MessageInput onSend={sendMessage} onTyping={sendTyping} />
      </div>
    </div>
  );
}
