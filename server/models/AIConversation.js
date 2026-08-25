const mongoose = require("mongoose");

/* Message Schema */
const messageSchema = new mongoose.Schema(
  {
    /* Message Sender */
    role: {
      type: String,
      enum: ["user", "assistant"],
      required: true,
    },

    /* Message Content */
    content: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

/* AI Conversation Schema */
const aiConversationSchema = new mongoose.Schema(
  {
    /* Conversation Owner */
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    /* Conversation Title */
    title: {
      type: String,
      default: "New Conversation",
      trim: true,
    },

    /* Conversation Messages */
    messages: {
      type: [messageSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "AIConversation",
  aiConversationSchema
);