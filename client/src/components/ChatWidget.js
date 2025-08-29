import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Minimize2 } from 'lucide-react';
import { useChat } from '../hooks/useChat';
import ChatMessage from './ChatMessage';
import LeadCaptureForm from './LeadCaptureForm';
import TypingIndicator from './TypingIndicator';

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [showLeadForm, setShowLeadForm] = useState(false);
  
  const {
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
  } = useChat();

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || isLoading) return;
    
    const message = inputMessage;
    setInputMessage('');
    await sendMessage(message);
  };

  const handleLeadCapture = () => {
    setShowLeadForm(true);
    setShouldCaptureLeads(false);
  };

  const handleLeadCaptured = () => {
    setShowLeadForm(false);
    const confirmationMessage = {
      id: Date.now(),
      role: 'assistant',
      content: "Thank you for providing your information! Our team will get back to you within 24 hours. Is there anything else I can help you with today?",
      timestamp: new Date()
    };
    // This would need to be handled by the chat hook
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
    setIsMinimized(false);
  };

  const minimizeChat = () => {
    setIsMinimized(true);
  };

  const maximizeChat = () => {
    setIsMinimized(false);
  };

  return (
    <>
      {/* Chat Widget */}
      <div className="fixed bottom-6 right-6 z-50">
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 20 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className={`mb-4 bg-white rounded-2xl shadow-2xl border border-gray-200 ${
                isMinimized ? 'w-80 h-16' : 'w-96 h-[600px]'
              } flex flex-col overflow-hidden`}
            >
              {/* Header */}
              <div className="bg-metalogics-blue text-white p-4 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                    <MessageCircle size={16} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm">Metalogics Assistant</h3>
                    <p className="text-xs text-blue-100">
                      {sessionId ? 'Online' : 'Connecting...'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {!isMinimized && (
                    <button
                      onClick={minimizeChat}
                      className="p-1 hover:bg-white/20 rounded transition-colors"
                    >
                      <Minimize2 size={16} />
                    </button>
                  )}
                  <button
                    onClick={toggleChat}
                    className="p-1 hover:bg-white/20 rounded transition-colors"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>

              {!isMinimized && (
                <>
                  {/* Messages Area */}
                  <div className="flex-1 overflow-hidden flex flex-col">
                    {showLeadForm ? (
                      <LeadCaptureForm
                        sessionId={sessionId}
                        onSuccess={handleLeadCaptured}
                        onCancel={() => setShowLeadForm(false)}
                      />
                    ) : (
                      <>
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 chat-messages">
                          {messages.map((message) => (
                            <ChatMessage key={message.id} message={message} />
                          ))}
                          
                          {isTyping && <TypingIndicator />}
                          
                          {error && (
                            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                              <p className="text-red-600 text-sm">{error}</p>
                              <button
                                onClick={() => setError(null)}
                                className="text-red-500 text-xs underline mt-1"
                              >
                                Dismiss
                              </button>
                            </div>
                          )}
                          
                          {shouldCaptureLeads && !showLeadForm && (
                            <motion.div
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="bg-blue-50 border border-blue-200 rounded-lg p-3"
                            >
                              <p className="text-blue-800 text-sm mb-2">
                                Would you like to schedule a consultation or get a quote?
                              </p>
                              <button
                                onClick={handleLeadCapture}
                                className="bg-metalogics-blue text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition-colors"
                              >
                                Yes, let's talk!
                              </button>
                            </motion.div>
                          )}
                          
                          <div ref={messagesEndRef} />
                        </div>

                        {/* Input Area */}
                        <div className="border-t border-gray-200 p-4">
                          <form onSubmit={handleSendMessage} className="flex space-x-2">
                            <input
                              type="text"
                              value={inputMessage}
                              onChange={(e) => setInputMessage(e.target.value)}
                              placeholder="Type your message..."
                              className="flex-1 chat-input"
                              disabled={isLoading}
                            />
                            <button
                              type="submit"
                              disabled={isLoading || !inputMessage.trim()}
                              className="chat-button p-3 rounded-full"
                            >
                              <Send size={16} />
                            </button>
                          </form>
                        </div>
                      </>
                    )}
                  </div>
                </>
              )}

              {isMinimized && (
                <div 
                  className="flex-1 flex items-center justify-center cursor-pointer"
                  onClick={maximizeChat}
                >
                  <p className="text-gray-600 text-sm">Click to expand chat</p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Chat Toggle Button */}
        <motion.button
          onClick={toggleChat}
          className="bg-metalogics-blue hover:bg-blue-700 text-white p-4 rounded-full shadow-lg transition-colors duration-200"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <AnimatePresence mode="wait">
            {isOpen ? (
              <motion.div
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <X size={24} />
              </motion.div>
            ) : (
              <motion.div
                key="open"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="relative"
              >
                <MessageCircle size={24} />
                {/* Notification dot */}
                <motion.div
                  className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
      </div>
    </>
  );
};

export default ChatWidget;
