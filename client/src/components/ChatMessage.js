import React from 'react';
import { motion } from 'framer-motion';
import { Bot, User, ExternalLink } from 'lucide-react';
import { format } from 'date-fns';

const ChatMessage = ({ message }) => {
  const isUser = message.role === 'user';
  const isError = message.isError;

  const formatTime = (timestamp) => {
    return format(new Date(timestamp), 'HH:mm');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} items-end space-x-2`}
    >
      {!isUser && (
        <div className="w-8 h-8 bg-metalogics-blue rounded-full flex items-center justify-center flex-shrink-0">
          <Bot size={16} className="text-white" />
        </div>
      )}
      
      <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} max-w-xs lg:max-w-md`}>
        <div
          className={`chat-message ${isUser ? 'user' : 'assistant'} ${
            isError ? 'bg-red-100 text-red-800 border border-red-200' : ''
          }`}
        >
          <p className="whitespace-pre-wrap">{message.content}</p>
          
          {/* Relevant content links */}
          {message.relevantContent && message.relevantContent.length > 0 && (
            <div className="mt-2 pt-2 border-t border-gray-200">
              <p className="text-xs text-gray-600 mb-1">Related resources:</p>
              {message.relevantContent.map((content, index) => (
                <a
                  key={index}
                  href={content.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-xs text-blue-600 hover:text-blue-800 mb-1"
                >
                  <ExternalLink size={10} className="mr-1" />
                  {content.title}
                </a>
              ))}
            </div>
          )}
        </div>
        
        <div className="flex items-center mt-1 space-x-2">
          <span className="text-xs text-gray-500">
            {formatTime(message.timestamp)}
          </span>
          
          {message.confidence && (
            <span className={`text-xs px-1 rounded ${
              message.confidence === 'high' 
                ? 'bg-green-100 text-green-600' 
                : 'bg-yellow-100 text-yellow-600'
            }`}>
              {message.confidence}
            </span>
          )}
        </div>
      </div>
      
      {isUser && (
        <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0">
          <User size={16} className="text-gray-600" />
        </div>
      )}
    </motion.div>
  );
};

export default ChatMessage;
