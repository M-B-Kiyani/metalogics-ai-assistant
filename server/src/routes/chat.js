const express = require('express');
const Joi = require('joi');
const { v4: uuidv4 } = require('uuid');
const ragService = require('../services/ragService');
const Conversation = require('../models/Conversation');

const router = express.Router();

// Validation schemas
const chatSchema = Joi.object({
  message: Joi.string().required().max(1000),
  sessionId: Joi.string().optional(),
  context: Joi.array().items(Joi.object({
    role: Joi.string().valid('user', 'assistant').required(),
    content: Joi.string().required()
  })).optional()
});

// Initialize chat session
router.post('/init', async (req, res) => {
  try {
    const sessionId = uuidv4();
    const userAgent = req.get('User-Agent');
    const userIp = req.ip || req.connection.remoteAddress;

    const conversation = await Conversation.create({
      session_id: sessionId,
      user_ip: userIp,
      user_agent: userAgent,
      messages: [],
      status: 'active'
    });

    res.json({
      success: true,
      sessionId: sessionId,
      message: 'Chat session initialized'
    });
  } catch (error) {
    console.error('Error initializing chat:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to initialize chat session'
    });
  }
});

// Send message
router.post('/message', async (req, res) => {
  try {
    const { error, value } = chatSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        error: error.details[0].message
      });
    }

    const { message, sessionId, context = [] } = value;

    // Find or create conversation
    let conversation;
    if (sessionId) {
      conversation = await Conversation.findOne({ where: { session_id: sessionId } });
    }
    
    if (!conversation) {
      const newSessionId = uuidv4();
      conversation = await Conversation.create({
        session_id: newSessionId,
        user_ip: req.ip,
        user_agent: req.get('User-Agent'),
        messages: [],
        status: 'active'
      });
    }

    // Generate response using RAG
    const ragResponse = await ragService.generateResponse(message, context);

    // Update conversation with new messages
    const updatedMessages = [
      ...conversation.messages,
      { role: 'user', content: message, timestamp: new Date() },
      { role: 'assistant', content: ragResponse.response, timestamp: new Date() }
    ];

    await conversation.update({ messages: updatedMessages });

    // Determine if this looks like a lead capture opportunity
    const leadCaptureTriggers = [
      'contact', 'appointment', 'schedule', 'meeting', 'consultation',
      'quote', 'pricing', 'interested', 'help', 'project'
    ];
    
    const shouldCaptureLeads = leadCaptureTriggers.some(trigger => 
      message.toLowerCase().includes(trigger)
    );

    res.json({
      success: true,
      response: ragResponse.response,
      sessionId: conversation.session_id,
      confidence: ragResponse.confidence,
      shouldCaptureLeads,
      relevantContent: ragResponse.relevantContent.map(item => ({
        title: item.title,
        url: item.url
      }))
    });

  } catch (error) {
    console.error('Error processing message:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to process message',
      response: "I apologize, but I'm experiencing technical difficulties. Please try again or contact our support team directly."
    });
  }
});

// Get conversation history
router.get('/history/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;
    
    const conversation = await Conversation.findOne({
      where: { session_id: sessionId }
    });

    if (!conversation) {
      return res.status(404).json({
        success: false,
        error: 'Conversation not found'
      });
    }

    res.json({
      success: true,
      messages: conversation.messages,
      leadCaptured: conversation.lead_captured
    });
  } catch (error) {
    console.error('Error fetching conversation history:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch conversation history'
    });
  }
});

// End conversation
router.post('/end/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;
    
    await Conversation.update(
      { status: 'completed' },
      { where: { session_id: sessionId } }
    );

    res.json({
      success: true,
      message: 'Conversation ended'
    });
  } catch (error) {
    console.error('Error ending conversation:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to end conversation'
    });
  }
});

module.exports = router;
