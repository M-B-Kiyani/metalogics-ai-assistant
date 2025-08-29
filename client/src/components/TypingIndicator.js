import React from 'react';
import { motion } from 'framer-motion';
import { Bot } from 'lucide-react';

const TypingIndicator = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex justify-start items-end space-x-2"
    >
      <div className="w-8 h-8 bg-metalogics-blue rounded-full flex items-center justify-center flex-shrink-0">
        <Bot size={16} className="text-white" />
      </div>
      
      <div className="bg-gray-100 rounded-2xl rounded-bl-md px-4 py-3 max-w-xs">
        <div className="typing-indicator">
          <motion.div
            className="typing-dot"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
          />
          <motion.div
            className="typing-dot"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
          />
          <motion.div
            className="typing-dot"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
          />
        </div>
      </div>
    </motion.div>
  );
};

export default TypingIndicator;
