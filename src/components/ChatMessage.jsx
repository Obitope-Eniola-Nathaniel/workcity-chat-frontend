import React from "react";

export default function ChatMessage({ message, mine = false }) {
  const time = message.createdAt
    ? new Date(message.createdAt).toLocaleTimeString()
    : "";

  return (
    <div
      className={`w-full ${mine ? "justify-end flex" : "justify-start flex"}`}
    >
      <div
        className={`${
          mine ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-900"
        } max-w-xl p-3 rounded-lg`}
      >
        <div className="text-sm font-medium">
          {message.sender?.name || (message.sender && message.sender.name)}
        </div>
        <div className="mt-1">{message.content}</div>
        <div className="text-xs text-gray-300 mt-2 text-right">{time}</div>
      </div>
    </div>
  );
}
