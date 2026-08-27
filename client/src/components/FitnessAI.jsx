import { useEffect, useRef, useState } from "react";

import {
  deleteAIConversation,
  getAIConversations,
  getAIStatus,
  sendAIMessage,
} from "../api/aiApi";

import "./FitnessAI.css";

function FitnessAI({ token }) {
  const [minimized, setMinimized] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [conversations, setConversations] = useState([]);
  const [conversationId, setConversationId] = useState(null);

  const [isPaidMember, setIsPaidMember] = useState(false);
  const [remainingFreeMessages, setRemainingFreeMessages] = useState(null);
  const [freeDailyLimit, setFreeDailyLimit] = useState(5);
  const [statusLoaded, setStatusLoaded] = useState(false);

  const messagesEndRef = useRef(null);

  /* LOAD ACCESS STATUS AND SAVED CONVERSATIONS */
  useEffect(() => {
    async function loadAccess() {
      setError("");
      setConversations([]);
      setConversationId(null);
      setStatusLoaded(false);

      /* Guest */
      if (!token) {
        setIsPaidMember(false);
        setRemainingFreeMessages(null);
        setStatusLoaded(true);
        return;
      }

      try {
        const status = await getAIStatus(token);

        setIsPaidMember(status.isPaidMember);
        setRemainingFreeMessages(status.remainingFreeMessages);
        setFreeDailyLimit(status.freeDailyLimit || 5);

        if (status.isPaidMember) {
          const savedConversations = await getAIConversations(token);
          setConversations(savedConversations);
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setStatusLoaded(true);
      }
    }

    loadAccess();
  }, [token]);

  /* SCROLL TO NEWEST MESSAGE */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  function startNewConversation() {
    setConversationId(null);
    setMessages([]);
    setError("");
  }

  function selectConversation(conversation) {
    if (!isPaidMember) return;

    setConversationId(conversation._id);
    setMessages(conversation.messages || []);
    setError("");
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const trimmedInput = input.trim();

    if (!trimmedInput || loading) {
      return;
    }

    if (
      token &&
      statusLoaded &&
      !isPaidMember &&
      remainingFreeMessages === 0
    ) {
      setError(
        `You have reached your ${freeDailyLimit} free Fitness AI messages for today. Upgrade to a paid membership for full access.`
      );
      return;
    }

    setError("");

    const userMessage = {
      role: "user",
      content: trimmedInput,
    };

    const previousMessages = messages;

    setMessages([...previousMessages, userMessage]);
    setInput("");

    try {
      setLoading(true);

      const data = await sendAIMessage({
        message: trimmedInput,
        conversationId: isPaidMember ? conversationId : null,
        guestMessages: isPaidMember ? [] : previousMessages,
        token,
      });

      const assistantMessage = {
        role: "assistant",
        content: data.message,
      };

      setMessages([...previousMessages, userMessage, assistantMessage]);

      if (token && !isPaidMember) {
        setRemainingFreeMessages(data.remainingFreeMessages);
      }

      if (token && isPaidMember) {
        if (!conversationId && data.conversationId) {
          setConversationId(data.conversationId);
        }

        const updated = await getAIConversations(token);
        setConversations(updated);
      }
    } catch (error) {
      if (error.remainingFreeMessages !== undefined) {
        setRemainingFreeMessages(error.remainingFreeMessages);
      }

      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(event, id) {
    event.stopPropagation();

    if (!isPaidMember) return;

    try {
      await deleteAIConversation(id, token);

      setConversations((current) =>
        current.filter((conversation) => conversation._id !== id)
      );

      if (conversationId === id) {
        setConversationId(null);
        setMessages([]);
      }
    } catch (error) {
      setError(error.message);
    }
  }

  if (minimized) {
    return (
      <button
        className="fitness-ai-minimized"
        onClick={() => setMinimized(false)}
        aria-label="Open Fitness AI"
      >
        Fitness Helper
      </button>
    );
  }

  return (
    <aside className="fitness-ai-widget">
      <div className="fitness-ai-header">
        <div>
          <strong>Fitness AI</strong>

          <span>
            {!token && " Guest session"}
            {token && isPaidMember && " Paid member • Saved conversations"}
            {token && statusLoaded && !isPaidMember && " Free account"}
          </span>
        </div>

        <button
          className="fitness-ai-minimize"
          onClick={() => setMinimized(true)}
          aria-label="Minimize Fitness AI"
        >
          −
        </button>
      </div>

      {/* FREE REGISTERED USER NOTICE */}
      {token && statusLoaded && !isPaidMember && (
        <div className="fitness-ai-guest-notice">
          Free account: {remainingFreeMessages ?? freeDailyLimit} of {freeDailyLimit}{" "}
          AI messages remaining today. Conversations are temporary and are not
          saved. Upgrade to a paid membership to save conversation history.
        </div>
      )}

      {/* GUEST NOTICE */}
      {!token && (
        <div className="fitness-ai-guest-notice">
          Guest conversations are temporary and will disappear when you refresh
          the page.
        </div>
      )}

      {/* PAID MEMBER CONVERSATION HISTORY */}
      {token && isPaidMember && (
        <div className="fitness-ai-history">
          <div className="fitness-ai-history-heading">
            <span>Conversations</span>

            <button onClick={startNewConversation}>+ New</button>
          </div>

          <div className="fitness-ai-conversation-list">
            {conversations.length === 0 && (
              <p className="fitness-ai-empty">No saved conversations.</p>
            )}

            {conversations.map((conversation) => (
              <button
                type="button"
                key={conversation._id}
                className={
                  conversationId === conversation._id
                    ? "fitness-ai-conversation active"
                    : "fitness-ai-conversation"
                }
                onClick={() => selectConversation(conversation)}
              >
                <span>{conversation.title}</span>

                <span
                  className="fitness-ai-delete"
                  role="button"
                  tabIndex="0"
                  onClick={(event) => handleDelete(event, conversation._id)}
                >
                  ×
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="fitness-ai-messages">
        {messages.length === 0 && (
          <div className="fitness-ai-welcome">
            <strong>How can I help?</strong>
            <p>Ask me about workouts, exercises, or fitness.</p>
          </div>
        )}

        {messages.map((message, index) => (
          <div
            key={index}
            className={
              message.role === "user"
                ? "fitness-ai-message user"
                : "fitness-ai-message assistant"
            }
          >
            {message.content}
          </div>
        ))}

        {loading && (
          <div className="fitness-ai-message assistant">Thinking...</div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {error && <div className="fitness-ai-error">{error}</div>}

      <form className="fitness-ai-form" onSubmit={handleSubmit}>
        <textarea
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder="Ask Fitness AI..."
          rows="2"
          disabled={
            token &&
            statusLoaded &&
            !isPaidMember &&
            remainingFreeMessages === 0
          }
        />

        <button
          type="submit"
          disabled={
            loading ||
            !input.trim() ||
            (token &&
              statusLoaded &&
              !isPaidMember &&
              remainingFreeMessages === 0)
          }
        >
          Send
        </button>
      </form>
    </aside>
  );
}

export default FitnessAI;
