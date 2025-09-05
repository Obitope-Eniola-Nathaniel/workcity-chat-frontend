import React from "react";

export default function ChatMessage({ message, mine = false }) {
  const time = message.createdAt
    ? new Date(message.createdAt).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "";

  // fallback for sender name
  const senderName = mine
    ? "You"
    : message.sender?.username || message.sender?.name || "Me";

  // check message status (optimistic UI)
  const isTemp = message._id?.startsWith("temp-");
  const status = isTemp ? "Sending..." : message.error ? "Failed" : "";

  return (
    <div className={`flex w-full ${mine ? "justify-end" : "justify-start"}`}>
      <div
        className={`relative max-w-xs sm:max-w-md md:max-w-lg p-3 rounded-2xl shadow ${
          mine
            ? "bg-blue-600 text-white rounded-br-none"
            : "bg-gray-100 text-gray-900 rounded-bl-none"
        }`}
      >
        {/* sender */}
        {!mine && (
          <div className="text-sm font-medium text-gray-700 mb-1">
            {senderName}
          </div>
        )}

        {/* content */}
        <div className="whitespace-pre-wrap break-words">{message.content}</div>

        {/* footer: time + status */}
        <div className="flex justify-end items-center gap-2 mt-1 text-xs">
          {status && (
            <span
              className={`${
                status === "Failed" ? "text-red-400" : "text-gray-400"
              }`}
            >
              {status}
            </span>
          )}
          {time && <span className="text-gray-300">{time}</span>}
        </div>
      </div>
    </div>
  );
}
