import React, { useState, useRef } from "react";

export default function MessageInput({ onSend, onTyping }) {
  const [text, setText] = useState("");
  const typingTimer = useRef(null);

  const handleChange = (e) => {
    setText(e.target.value);

    if (onTyping) {
      onTyping(true);
      clearTimeout(typingTimer.current);
      typingTimer.current = setTimeout(() => {
        onTyping(false);
      }, 1000); // wait 1s after user stops typing
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  };

  const submit = (e) => {
    if (e) e.preventDefault();
    if (!text.trim()) return;

    onSend(text.trim());
    setText("");
    if (onTyping) onTyping(false);
  };

  return (
    <form onSubmit={submit} className="flex items-center gap-2">
      <textarea
        rows={1}
        className="flex-1 p-2 rounded border resize-none bg-white dark:bg-gray-800"
        placeholder="Type a message..."
        aria-label="Message input"
        value={text}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
      />
      <button
        type="submit"
        aria-label="Send message"
        disabled={!text.trim()}
        className={`px-4 py-2 rounded ${
          text.trim()
            ? "bg-blue-600 hover:bg-blue-700 text-white"
            : "bg-gray-300 text-gray-500 cursor-not-allowed"
        }`}
      >
        Send
      </button>
    </form>
  );
}
