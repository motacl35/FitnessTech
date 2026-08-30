const express = require("express");
const { GoogleGenAI } = require("@google/genai");

const AIConversation = require("../models/AIConversation");
const User = require("../models/User");
const authenticate = require("../middleware/authenticate");
const optionalAuthenticate = require("../middleware/optionalAuthenticate");
const requirePaidMember = require("../middleware/requirePaidMember");

const router = express.Router();

const FREE_AI_DAILY_LIMIT = 5;

/* CREATE GEMINI CLIENT */
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

/* CHECK PAID MEMBERSHIP */
function isActivePaidMember(user) {
  return Boolean(user?.membershipTier) && user.membershipStatus === "Active";
}

/* CHECK UTC DATE */
function isSameUtcDay(dateA, dateB) {
  if (!dateA || !dateB) return false;

  return (
    new Date(dateA).toISOString().slice(0, 10) ===
    new Date(dateB).toISOString().slice(0, 10)
  );
}

/* GET FREE AI USAGE */
function getFreeAIUsage(user) {
  const today = new Date();
  const sameDay = isSameUtcDay(user.aiUsage?.lastUsageDate, today);
  const used = sameDay ? user.aiUsage?.dailyCount || 0 : 0;

  return {
    used,
    remaining: Math.max(FREE_AI_DAILY_LIMIT - used, 0),
  };
}

/* GET AI ACCESS STATUS */
router.get("/status", authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({
        error: "User not found.",
      });
    }

    const paidMember = isActivePaidMember(user);
    const usage = getFreeAIUsage(user);

    res.json({
      isPaidMember: paidMember,
      membershipTier: user.membershipTier || null,
      membershipStatus: user.membershipStatus || null,
      canSaveConversations: paidMember,
      freeDailyLimit: paidMember ? null : FREE_AI_DAILY_LIMIT,
      remainingFreeMessages: paidMember ? null : usage.remaining,
    });
  } catch (error) {
    console.error("AI status error:", error);

    res.status(500).json({
      error: "Unable to load AI access status.",
    });
  }
});

/* GENERATE AI RESPONSE */
router.post("/chat", optionalAuthenticate, async (req, res) => {
  try {
    const { message, conversationId, guestMessages = [] } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({
        error: "Message is required.",
      });
    }

    let conversation = null;
    let previousMessages = [];
    let user = null;
    let paidMember = false;
    let accountType = "Guest user";

    /* CHECK LOGGED-IN USER */
    if (req.user?.userId) {
      user = await User.findById(req.user.userId);

      if (!user) {
        return res.status(404).json({
          error: "User not found.",
        });
      }

      paidMember = isActivePaidMember(user);

      if (paidMember) {
        accountType = "Paid member";
      } else {
        accountType = "Free registered user";
      }

      /* FREE REGISTERED USER */
      if (!paidMember) {
        const usage = getFreeAIUsage(user);

        if (usage.remaining <= 0) {
          return res.status(429).json({
            error:
              "You have reached your 5 free Fitness Helper messages for today. Upgrade to a paid membership for full access and saved conversations.",
            isPaidMember: false,
            canSaveConversations: false,
            remainingFreeMessages: 0,
          });
        }

        previousMessages = Array.isArray(guestMessages)
          ? guestMessages
          : [];
      }

      /* PAID MEMBER */
      if (paidMember && conversationId) {
        conversation = await AIConversation.findOne({
          _id: conversationId,
          user: req.user.userId,
        });

        if (!conversation) {
          return res.status(404).json({
            error: "Conversation not found.",
          });
        }

        previousMessages = conversation.messages;
      }
    } else {
      /* GUEST USER */
      previousMessages = Array.isArray(guestMessages)
        ? guestMessages
        : [];
    }

    /* BUILD CONVERSATION CONTEXT */
    const conversationContext = previousMessages
      .map((item) => {
        const speaker =
          item.role === "assistant"
            ? "Fitness Helper 1.0"
            : "User";

        return `${speaker}: ${item.content}`;
      })
      .join("\n");

    /* BUILD ACCOUNT CONTEXT */
    let accountContext = "";

    if (paidMember) {
      accountContext = `
The current user is a logged-in paid FitnessTech member.

Membership tier: ${user.membershipTier}
Membership status: ${user.membershipStatus}

This user has full Fitness Helper access and saved conversations.

IMPORTANT:
- Do not tell this user they have a five-message free limit.
- Do not tell this user to upgrade their membership.
- Do not describe this user as a free user or guest.
`;
    } else if (user) {
      accountContext = `
The current user is logged in with a free FitnessTech account.

Free registered users receive up to ${FREE_AI_DAILY_LIMIT} Fitness Helper messages per day.
Free registered users do not have saved AI conversations.

The FitnessTech backend controls and enforces these limits.
`;
    } else {
      accountContext = `
The current user is using Fitness Helper as a guest.

Guest conversations are temporary and are not saved to a FitnessTech account.

The FitnessTech application controls guest access and restrictions.
`;
    }

    /* CREATE GEMINI PROMPT */
const prompt = `
You are Fitness Helper 1.0, the AI fitness assistant for the FitnessTech gym website.

Current account type:
${accountType}

${accountContext}

Your purpose is to help users with fitness and explain how FitnessTech can help them reach their fitness goals.

You may ONLY provide information related to:
- exercise
- workout routines
- strength training
- weight training
- cardio
- flexibility
- mobility
- exercise technique and form
- muscle groups
- workout planning
- fitness goals
- general recovery information
- general fitness education
- FitnessTech gym services and features
- how FitnessTech can help users achieve their fitness goals

IMPORTANT SCOPE RULES:
- Only answer questions related to fitness, exercise, workouts, recovery, or FitnessTech.
- Do NOT answer unrelated questions.
- Do NOT answer math, programming, history, politics, entertainment, general trivia, or other unrelated topics.
- Do NOT answer an unrelated question even if you know the answer.
- Do NOT partially answer an unrelated question before redirecting the user.
- If a question is unrelated to fitness or FitnessTech, politely explain that you are Fitness Helper 1.0 and can only assist with fitness, workouts, exercise, recovery, and FitnessTech.
- Then invite the user to ask a fitness-related question.
- Basic calculations that are directly necessary for a fitness question are allowed.

FITNESSTECH RULES:
- FitnessTech is the gym and fitness platform you represent.
- When relevant, explain how FitnessTech can help the user accomplish their fitness goals.
- You may recommend FitnessTech's workout resources, workout tracking, Fitness Helper, and available membership features when relevant.
- Present FitnessTech positively and confidently.
- Do not invent FitnessTech services, equipment, prices, membership benefits, or features that have not been provided to you.
- Do not criticize or negatively compare FitnessTech with other gyms.
- Do not make unsupported claims such as saying FitnessTech guarantees results.
- Keep recommendations natural. Do not turn every answer into an advertisement.

SAFETY RULES:
- Do not diagnose medical conditions.
- Do not claim to replace a physician, physical therapist, dietitian, or other healthcare professional.
- If someone describes an injury, severe pain, medical emergency, or potentially dangerous symptoms, encourage them to seek appropriate professional medical care.
- Do not encourage dangerous exercise practices.

ACCOUNT RULES:
- The FitnessTech backend determines the user's account type and permissions.
- Do not invent information about the user's account.
- Do not invent membership restrictions.
- Do not tell paid members that they have a five-message free limit.
- Do not tell paid members to upgrade their membership.
- Do not claim that a guest or free user is a paid member.

Previous conversation:
${conversationContext || "No previous messages."}

User:
${message}

Fitness Helper 1.0:
`;

    /* SEND REQUEST TO GEMINI */
    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
    });

    const aiResponse = response.text;

    /* SAVE PAID MEMBER CONVERSATION */
    if (req.user?.userId && paidMember) {
      if (!conversation) {
        conversation = new AIConversation({
          user: req.user.userId,
          title:
            message.length > 40
              ? `${message.substring(0, 40)}...`
              : message,
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

    if (req.user?.userId && !paidMember) {
      const today = new Date();
      const sameDay = isSameUtcDay(
        user.aiUsage?.lastUsageDate,
        today
      );

      if (!user.aiUsage) {
        user.aiUsage = {
          dailyCount: 0,
          lastUsageDate: today,
        };
      }

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

    /* SEND RESPONSE */
    res.json({
      message: aiResponse,
      conversationId:
        paidMember && conversation
          ? conversation._id
          : null,
      accountType,
      membershipTier: user?.membershipTier || null,
      membershipStatus: user?.membershipStatus || null,
      isPaidMember: paidMember,
      canSaveConversations: paidMember,
      remainingFreeMessages,
    });
  } catch (error) {
    console.error("Fitness AI Error:", error);

    res.status(500).json({
      error:
        error.message ||
        "Unable to generate AI response.",
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
      console.error("Get AI conversations error:", error);

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
        return res.status(404).json({
          error: "Conversation not found.",
        });
      }

      res.json(conversation);
    } catch (error) {
      console.error("Get AI conversation error:", error);

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
      const conversation =
        await AIConversation.findOneAndDelete({
          _id: req.params.id,
          user: req.user.userId,
        });

      if (!conversation) {
        return res.status(404).json({
          error: "Conversation not found.",
        });
      }

      res.json({
        message: "Conversation deleted successfully.",
      });
    } catch (error) {
      console.error("Delete AI conversation error:", error);

      res.status(500).json({
        error: "Unable to delete conversation.",
      });
    }
  }
);

module.exports = router;