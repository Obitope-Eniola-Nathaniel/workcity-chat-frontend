import React from "react";

export default function ChatMessage({ message, mine }) {
  return (
    <div className={`flex ${mine ? "justify-end" : "justify-start"} mb-2`}>
      <div
        className={`${
          mine ? "bg-blue-600 text-white" : "bg-white"
        } p-3 rounded shadow max-w-xs`}
      >
        <div className="text-sm">{message.content}</div>
        <div className="text-xs text-gray-400 mt-1">
          {new Date(message.createdAt).toLocaleTimeString()}
        </div>
      </div>
    </div>
  );
}
