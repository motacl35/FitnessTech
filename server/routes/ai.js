const express = require("express");
const { GoogleGenAI } = require("@google/genai");

const AIConversation = require("../models/AIConversation");
const User = require("../models/User");
const authenticate = require("../middleware/authenticate");
const optionalAuthenticate = require("../middleware/optionalAuthenticate");
const requirePaidMember = require("../middleware/requirePaidMember");

const router = express.Router();

const FREE_AI_DAILY_LIMIT = 5;

/* Create Gemini Client */
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

function isActivePaidMember(user) {
  return Boolean(user?.membershipTier) && user.membershipStatus === "Active";
}

function isSameUtcDay(dateA, dateB) {
  if (!dateA || !dateB) return false;

  return (
    new Date(dateA).toISOString().slice(0, 10) ===
    new Date(dateB).toISOString().slice(0, 10)
  );
}

function getFreeAIUsage(user) {
  const today = new Date();
  const sameDay = isSameUtcDay(user.aiUsage?.lastUsageDate, today);
  const used = sameDay ? user.aiUsage?.dailyCount || 0 : 0;

  return {
    used,
    remaining: Math.max(FREE_AI_DAILY_LIMIT - used, 0),
  };
}

/* GET AI ACCESS STATUS FOR LOGGED-IN USER */
router.get("/status", authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    const paidMember = isActivePaidMember(user);
    const usage = getFreeAIUsage(user);

    res.json({
      isPaidMember: paidMember,
      canSaveConversations: paidMember,
      freeDailyLimit: FREE_AI_DAILY_LIMIT,
      remainingFreeMessages: paidMember ? null : usage.remaining,
    });
  } catch (error) {
    console.error("AI status error:", error);
    res.status(500).json({ error: "Unable to load AI access status." });
  }
});

/* GENERATE AI RESPONSE */
router.post("/chat", optionalAuthenticate, async (req, res) => {
  try {
    const { message, conversationId, guestMessages = [] } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({ error: "Message is required." });
    }

    let conversation = null;
    let previousMessages = [];
    let user = null;
    let paidMember = false;

    /* LOGGED-IN USER */
    if (req.user) {
      user = await User.findById(req.user.userId);

      if (!user) {
        return res.status(404).json({ error: "User not found." });
      }

      paidMember = isActivePaidMember(user);

      /* FREE REGISTERED USER */
      if (!paidMember) {
        const usage = getFreeAIUsage(user);

        if (usage.remaining <= 0) {
          return res.status(429).json({
            error:
              "You have reached your 5 free Fitness AI messages for today. Upgrade to a paid membership for full access and saved conversations.",
            remainingFreeMessages: 0,
          });
        }

        previousMessages = Array.isArray(guestMessages) ? guestMessages : [];
      }

      /* PAID MEMBER */
      if (paidMember && conversationId) {
        conversation = await AIConversation.findOne({
          _id: conversationId,
          user: req.user.userId,
        });

        if (!conversation) {
          return res.status(404).json({ error: "Conversation not found." });
        }

        previousMessages = conversation.messages;
      }
    } else {
      /* GUEST USER - TEMPORARY SESSION */
      previousMessages = Array.isArray(guestMessages) ? guestMessages : [];
    }

    const conversationContext = previousMessages
      .map((item) => {
        const speaker =
          item.role === "assistant" ? "Fitness Helper 1.0" : "User";

        return `${speaker}: ${item.content}`;
      })
      .join("\n");

    const prompt = `
You are Fitness Helper 1.0, the AI assistant for the FitnessTech website.

Your job is to provide clear, practical, and helpful information about:
- exercise
- workouts
- strength training
- cardio
- fitness routines
- recovery
- general fitness education

Do not diagnose medical conditions.

Previous conversation:
${conversationContext || "No previous messages."}

User:
${message}

Fitness Helper 1.0:
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
    });

    const aiResponse = response.text;

    /* SAVE PAID MEMBER CONVERSATION */
    if (req.user && paidMember) {
      if (!conversation) {
        conversation = new AIConversation({
          user: req.user.userId,
          title:
            message.length > 40 ? `${message.substring(0, 40)}...` : message,
          messages: [],
        });
      }

      conversation.messages.push({
        role: "user",
        content: message,
      });

      conversation.messages.push({
        role: "assistant",
        content: aiResponse,
      });

      await conversation.save();
    }

    /* COUNT FREE REGISTERED USER MESSAGE */
    let remainingFreeMessages = null;

    if (req.user && !paidMember) {
      const today = new Date();
      const sameDay = isSameUtcDay(user.aiUsage?.lastUsageDate, today);

      if (!sameDay) {
        user.aiUsage.dailyCount = 0;
      }

      user.aiUsage.dailyCount += 1;
      user.aiUsage.lastUsageDate = today;

      await user.save();

      remainingFreeMessages = Math.max(
        FREE_AI_DAILY_LIMIT - user.aiUsage.dailyCount,
        0
      );
    }

    res.json({
      message: aiResponse,
      conversationId: paidMember ? conversation?._id || null : null,
      isPaidMember: paidMember,
      canSaveConversations: paidMember,
      remainingFreeMessages,
    });
  } catch (error) {
    console.error("Fitness AI Error:", error);

    res.status(500).json({
      error: error.message || "Unable to generate AI response.",
    });
  }
});

/* GET PAID MEMBER CONVERSATIONS */
router.get(
  "/conversations",
  authenticate,
  requirePaidMember,
  async (req, res) => {
    try {
      const conversations = await AIConversation.find({
        user: req.user.userId,
      })
        .sort({ updatedAt: -1 })
        .select("title messages createdAt updatedAt");

      res.json(conversations);
    } catch (error) {
      res.status(500).json({
        error: "Unable to retrieve conversations.",
      });
    }
  }
);

/* GET ONE PAID MEMBER CONVERSATION */
router.get(
  "/conversations/:id",
  authenticate,
  requirePaidMember,
  async (req, res) => {
    try {
      const conversation = await AIConversation.findOne({
        _id: req.params.id,
        user: req.user.userId,
      });

      if (!conversation) {
        return res.status(404).json({ error: "Conversation not found." });
      }

      res.json(conversation);
    } catch (error) {
      res.status(500).json({
        error: "Unable to retrieve conversation.",
      });
    }
  }
);

/* DELETE ONE PAID MEMBER CONVERSATION */
router.delete(
  "/conversations/:id",
  authenticate,
  requirePaidMember,
  async (req, res) => {
    try {
      const conversation = await AIConversation.findOneAndDelete({
        _id: req.params.id,
        user: req.user.userId,
      });

      if (!conversation) {
        return res.status(404).json({ error: "Conversation not found." });
      }

      res.json({ message: "Conversation deleted successfully." });
    } catch (error) {
      res.status(500).json({
        error: "Unable to delete conversation.",
      });
    }
  }
);

module.exports = router;
