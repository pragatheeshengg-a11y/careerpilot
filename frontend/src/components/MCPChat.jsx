
import { useState } from "react";

const API_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:5000"
).replace(/\/+$/, "");

const examples = [
  "How many applications do I have?",
  "Show my applications in Interview status.",
  "Give me statistics for all my application statuses.",
];

export default function MCPChat() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function sendMessage(value = message) {
    const text = value.trim();

    if (!text || loading) return;

    const token = localStorage.getItem("careerpilot_token");

    if (!token) {
      setError("Your session has expired. Please log in again.");
      return;
    }

    setMessages((previous) => [
      ...previous,
      { role: "user", text },
    ]);

    setMessage("");
    setError("");
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/mcp-chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ message: text }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to get an AI response."
        );
      }

      setMessages((previous) => [
        ...previous,
        { role: "assistant", text: data.reply },
      ]);
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  function handleSubmit(event) {
    event.preventDefault();
    sendMessage();
  }

  return (
    <section className="mcp-chat" id="mcp-chat">
      <div className="mcp-chat-heading">
        <span className="mcp-chat-badge">MCP + GEMINI</span>
        <h2>CareerPilot AI Chat</h2>
        <p>
          Ask questions about your saved applications and interview
          preparation.
        </p>
      </div>

      <div className="mcp-examples">
        {examples.map((example) => (
          <button
            type="button"
            key={example}
            disabled={loading}
            onClick={() => sendMessage(example)}
          >
            {example}
          </button>
        ))}
      </div>

      <div
        className="mcp-messages"
        aria-live="polite"
        aria-label="Chat messages"
      >
        {messages.length === 0 && (
          <p className="mcp-empty">
            Start by asking a question about your job search.
          </p>
        )}

        {messages.map((item, index) => (
          <div
            key={`${item.role}-${index}`}
            className={`mcp-message ${
              item.role === "user"
                ? "mcp-message-user"
                : "mcp-message-ai"
            }`}
          >
            <strong>
              {item.role === "user" ? "You" : "CareerPilot"}
            </strong>
            <p>{item.text}</p>
          </div>
        ))}

        {loading && (
          <div className="mcp-message mcp-message-ai">
            <strong>CareerPilot</strong>
            <p>Checking your tools and preparing an answer…</p>
          </div>
        )}
      </div>

      {error && (
        <p className="mcp-chat-error" role="alert">
          {error}
        </p>
      )}

      <form className="mcp-chat-form" onSubmit={handleSubmit}>
        <input
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          placeholder="Ask about your job applications..."
          maxLength={4000}
          disabled={loading}
          aria-label="Your message"
        />

        <button type="submit" disabled={loading || !message.trim()}>
          {loading ? "Thinking..." : "Send"}
        </button>
      </form>

      <p className="mcp-chat-note">
        Answers may use your saved application data or Gemini.
        Verify important information before making decisions.
      </p>
    </section>
  );
}
