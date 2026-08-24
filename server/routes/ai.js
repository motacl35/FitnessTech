const express = require("express");
const { GoogleGenAI } = require("@google/genai");

const AIConversation =
  require("../models/AIConversation");

const authenticate =
  require("../middleware/authenticate");

const optionalAuthenticate =
  require("../middleware/optionalAuthenticate");

const router = express.Router();

/* Create Gemini Client */
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});


/* GENERATE AI RESPONSE */

router.post(
  "/chat",
  optionalAuthenticate,
  async (req, res) => {
    try {
      /* Get Request Data */
      const {
        message,
        conversationId,
        guestMessages = [],
      } = req.body;

      /* Validate Message */
      if (!message || !message.trim()) {
        return res.status(400).json({
          error: "Message is required.",
        });
      }

      let conversation = null;
      let previousMessages = [];


      /* LOGGED-IN USER */

      if (req.user) {
        /* Load Existing Conversation */
        if (conversationId) {
          conversation =
            await AIConversation.findOne({
              _id: conversationId,
              user: req.user.userId,
            });

          if (!conversation) {
            return res.status(404).json({
              error: "Conversation not found.",
            });
          }

          previousMessages =
            conversation.messages;
        }
      }


      /* GUEST USER */

      else {
        previousMessages = Array.isArray(
          guestMessages
        )
          ? guestMessages
          : [];
      }


      /* Build Conversation Context */
      const conversationContext =
        previousMessages
          .map((item) => {
            const speaker =
              item.role === "assistant"
                ? "Fitness Helper 1.0"
                : "User";

            return `${speaker}: ${item.content}`;
          })
          .join("\n");


      /* Fitness AI Prompt */
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


      /* Generate Gemini Response */
      const response =
        await ai.models.generateContent({
          model: "gemini-3.6-flash",
          contents: prompt,
        });


      /* Get Response Text */
      const aiResponse = response.text;


      /* SAVE LOGGED-IN USER CONVERSATION */

      if (req.user) {
        /* Create New Conversation */
        if (!conversation) {
          conversation =
            new AIConversation({
              user: req.user.userId,

              title:
                message.length > 40
                  ? `${message.substring(
                      0,
                      40
                    )}...`
                  : message,

              messages: [],
            });
        }


        /* Save User Message */
        conversation.messages.push({
          role: "user",
          content: message,
        });


        /* Save AI Message */
        conversation.messages.push({
          role: "assistant",
          content: aiResponse,
        });


        /* Save Conversation */
        await conversation.save();
      }


      /* Return Response */
      res.json({
        message: aiResponse,

        conversationId:
          conversation?._id || null,
      });
    } catch (error) {
      console.error(
        "Fitness AI Error:",
        error
      );

      res.status(500).json({
        error:
          error.message ||
          "Unable to generate AI response.",
      });
    }
  }
);


/* GET LOGGED-IN USER CONVERSATIONS */

router.get(
  "/conversations",
  authenticate,
  async (req, res) => {
    try {
      const conversations =
        await AIConversation.find({
          user: req.user.userId,
        })
          .sort({ updatedAt: -1 })
          .select(
            "title messages createdAt updatedAt"
          );

      res.json(conversations);
    } catch (error) {
      res.status(500).json({
        error:
          "Unable to retrieve conversations.",
      });
    }
  }
);


/* GET ONE CONVERSATION */

router.get(
  "/conversations/:id",
  authenticate,
  async (req, res) => {
    try {
      const conversation =
        await AIConversation.findOne({
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
      res.status(500).json({
        error:
          "Unable to retrieve conversation.",
      });
    }
  }
);


/* DELETE ONE CONVERSATION */

router.delete(
  "/conversations/:id",
  authenticate,
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
        message:
          "Conversation deleted successfully.",
      });
    } catch (error) {
      res.status(500).json({
        error:
          "Unable to delete conversation.",
      });
    }
  }
);


module.exports = router;