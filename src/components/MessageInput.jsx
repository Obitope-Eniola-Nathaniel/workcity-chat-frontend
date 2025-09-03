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
      }, 800);
    }
  };

  const submit = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    onSend(text);
    setText("");
    if (onTyping) onTyping(false);
  };

  return (
    <form onSubmit={submit} className="flex items-center gap-2">
      <input
        className="flex-1 p-2 rounded border bg-white dark:bg-gray-800"
        placeholder="Type a message..."
        value={text}
        onChange={handleChange}
      />
      <button
        type="submit"
        className="px-4 py-2 bg-blue-600 text-white rounded"
      >
        Send
      </button>
    </form>
  );
}
