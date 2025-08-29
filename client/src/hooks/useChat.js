import { useState, useCallback, useRef, useEffect } from 'react';
import apiService from '../services/api';

export const useChat = () => {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [error, setError] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const [shouldCaptureLeads, setShouldCaptureLeads] = useState(false);
  
  const messagesEndRef = useRef(null);

  // Initialize chat session
  const initializeChat = useCallback(async () => {
    try {
      const response = await apiService.initChat();
      setSessionId(response.sessionId);
      
      // Add welcome message
      const welcomeMessage = {
        id: Date.now(),
        role: 'assistant',
        content: "Hello! I'm the Metalogics AI Assistant. I'm here to help you learn about our services and answer any questions you might have. How can I assist you today?",
        timestamp: new Date()
      };
      
      setMessages([welcomeMessage]);
    } catch (err) {
      setError('Failed to initialize chat. Please refresh and try again.');
      console.error('Chat initialization error:', err);
    }
  }, []);

  // Send message
  const sendMessage = useCallback(async (messageText) => {
    if (!messageText.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      role: 'user',
      content: messageText.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    setIsTyping(true);
    setError(null);

    try {
      // Prepare context (last 10 messages for context)
      const context = messages.slice(-10).map(msg => ({
        role: msg.role,
        content: msg.content
      }));

      const response = await apiService.sendMessage(messageText, sessionId, context);
      
      const assistantMessage = {
        id: Date.now() + 1,
        role: 'assistant',
        content: response.response,
        timestamp: new Date(),
        confidence: response.confidence,
        relevantContent: response.relevantContent
      };

      setMessages(prev => [...prev, assistantMessage]);
      setShouldCaptureLeads(response.shouldCaptureLeads);
      
      // Update session ID if provided
      if (response.sessionId && response.sessionId !== sessionId) {
        setSessionId(response.sessionId);
      }

    } catch (err) {
      setError(err.message || 'Failed to send message. Please try again.');
      
      // Add error message to chat
      const errorMessage = {
        id: Date.now() + 1,
        role: 'assistant',
        content: "I apologize, but I'm experiencing technical difficulties. Please try again or contact our support team directly.",
        timestamp: new Date(),
        isError: true
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      setIsTyping(false);
    }
  }, [messages, sessionId, isLoading]);

  // Clear chat
  const clearChat = useCallback(() => {
    setMessages([]);
    setSessionId(null);
    setError(null);
    setShouldCaptureLeads(false);
    initializeChat();
  }, [initializeChat]);

  // Scroll to bottom
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  // Auto-scroll when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // Initialize chat on mount
  useEffect(() => {
    initializeChat();
  }, [initializeChat]);

  return {
    messages,
    isLoading,
    isTyping,
    error,
    sessionId,
    shouldCaptureLeads,
    sendMessage,
    clearChat,
    messagesEndRef,
    setError,
    setShouldCaptureLeads
  };
};
