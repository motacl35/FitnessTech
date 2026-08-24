import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  deleteAIConversation,
  getAIConversations,
  sendAIMessage,
} from "../api/aiApi";

import "./FitnessAI.css";


/* Fitness AI Component */
function FitnessAI({ token }) {
  /* Widget State */
  const [minimized, setMinimized] =
    useState(false);

  /* Current Messages */
  const [messages, setMessages] =
    useState([]);

  /* User Input */
  const [input, setInput] =
    useState("");

  /* Loading State */
  const [loading, setLoading] =
    useState(false);

  /* Error State */
  const [error, setError] =
    useState("");

  /* Saved Conversations */
  const [
    conversations,
    setConversations,
  ] = useState([]);

  /* Current Conversation */
  const [
    conversationId,
    setConversationId,
  ] = useState(null);

  /* Message Container */
  const messagesEndRef =
    useRef(null);


  /* LOAD LOGGED-IN USER CONVERSATIONS */

  useEffect(() => {
    async function loadConversations() {
      /* Guest */
      if (!token) {
        setConversations([]);
        setConversationId(null);

        return;
      }

      try {
        const data =
          await getAIConversations(token);

        setConversations(data);
      } catch (error) {
        setError(error.message);
      }
    }

    loadConversations();
  }, [token]);


  /* SCROLL TO NEWEST MESSAGE */

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);


  /* START NEW CONVERSATION */

  function startNewConversation() {
    setConversationId(null);
    setMessages([]);
    setError("");
  }


  /* SELECT SAVED CONVERSATION */

  function selectConversation(
    conversation
  ) {
    setConversationId(
      conversation._id
    );

    setMessages(
      conversation.messages || []
    );

    setError("");
  }


  /* SEND MESSAGE */

  async function handleSubmit(event) {
    event.preventDefault();

    const trimmedInput =
      input.trim();

    if (!trimmedInput || loading) {
      return;
    }

    setError("");

    /* Current User Message */
    const userMessage = {
      role: "user",
      content: trimmedInput,
    };

    /* Messages Before Request */
    const previousMessages =
      messages;

    /* Show Message Immediately */
    setMessages([
      ...previousMessages,
      userMessage,
    ]);

    /* Clear Input */
    setInput("");

    try {
      setLoading(true);

      /* Send Request */
      const data =
        await sendAIMessage({
          message: trimmedInput,

          conversationId,

          guestMessages:
            token
              ? []
              : previousMessages,

          token,
        });


      /* AI Message */
      const assistantMessage = {
        role: "assistant",
        content: data.message,
      };


      /* Display AI Response */
      setMessages([
        ...previousMessages,
        userMessage,
        assistantMessage,
      ]);


      /* Logged-In User */
      if (token) {
        /* Save New Conversation ID */
        if (
          !conversationId &&
          data.conversationId
        ) {
          setConversationId(
            data.conversationId
          );
        }


        /* Reload Conversation List */
        const updated =
          await getAIConversations(
            token
          );

        setConversations(updated);
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }


  /* DELETE CONVERSATION */

  async function handleDelete(
    event,
    id
  ) {
    /* Prevent Selecting Conversation */
    event.stopPropagation();

    try {
      await deleteAIConversation(
        id,
        token
      );

      /* Remove From List */
      setConversations(
        (current) =>
          current.filter(
            (conversation) =>
              conversation._id !== id
          )
      );


      /* Deleted Current Conversation */
      if (conversationId === id) {
        setConversationId(null);
        setMessages([]);
      }
    } catch (error) {
      setError(error.message);
    }
  }


  /* MINIMIZED VIEW */

  if (minimized) {
    return (
      <button
        className="fitness-ai-minimized"
        onClick={() =>
          setMinimized(false)
        }
        aria-label="Open Fitness AI"
      >
        Fitness Helper
      </button>
    );
  }


  /* FULL AI WIDGET */

  return (
    <aside className="fitness-ai-widget">

      {/* AI Header */}
      <div className="fitness-ai-header">

        <div>
          <strong>
            Fitness AI
          </strong>

          <span>
            {token
              ? " Saved conversations"
              : " Guest session"}
          </span>
        </div>

        <button
          className="fitness-ai-minimize"
          onClick={() =>
            setMinimized(true)
          }
          aria-label="Minimize Fitness AI"
        >
          −
        </button>

      </div>


      {/* Logged-In Conversation History */}
      {token && (
        <div className="fitness-ai-history">

          <div className="fitness-ai-history-heading">

            <span>
              Conversations
            </span>

            <button
              onClick={
                startNewConversation
              }
            >
              + New
            </button>

          </div>


          <div className="fitness-ai-conversation-list">

            {conversations.length ===
              0 && (
              <p className="fitness-ai-empty">
                No saved conversations.
              </p>
            )}


            {conversations.map(
              (conversation) => (
                <button
                  type="button"
                  key={
                    conversation._id
                  }
                  className={
                    conversationId ===
                    conversation._id
                      ? "fitness-ai-conversation active"
                      : "fitness-ai-conversation"
                  }
                  onClick={() =>
                    selectConversation(
                      conversation
                    )
                  }
                >
                  <span>
                    {conversation.title}
                  </span>

                  <span
                    className="fitness-ai-delete"
                    role="button"
                    tabIndex="0"
                    onClick={(event) =>
                      handleDelete(
                        event,
                        conversation._id
                      )
                    }
                  >
                    ×
                  </span>
                </button>
              )
            )}

          </div>

        </div>
      )}


      {/* Guest Information */}
      {!token && (
        <div className="fitness-ai-guest-notice">
          Guest conversations are temporary
          and will disappear when you
          refresh the page.
        </div>
      )}


      {/* Messages */}
      <div className="fitness-ai-messages">

        {messages.length === 0 && (
          <div className="fitness-ai-welcome">
            <strong>
              How can I help?
            </strong>

            <p>
              Ask me about workouts,
              exercises, or fitness.
            </p>
          </div>
        )}


        {messages.map(
          (message, index) => (
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
          )
        )}


        {loading && (
          <div className="fitness-ai-message assistant">
            Thinking...
          </div>
        )}


        <div
          ref={messagesEndRef}
        />

      </div>


      {/* Error */}
      {error && (
        <div className="fitness-ai-error">
          {error}
        </div>
      )}


      {/* Message Form */}
      <form
        className="fitness-ai-form"
        onSubmit={handleSubmit}
      >

        <textarea
          value={input}
          onChange={(event) =>
            setInput(
              event.target.value
            )
          }
          placeholder="Ask Fitness AI..."
          rows="2"
        />

        <button
          type="submit"
          disabled={
            loading ||
            !input.trim()
          }
        >
          Send
        </button>

      </form>

    </aside>
  );
}

export default FitnessAI;