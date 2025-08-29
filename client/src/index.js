import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import ChatWidget from './components/ChatWidget';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8 text-metalogics-dark">
          Metalogics AI Assistant Demo
        </h1>
        <p className="text-center text-gray-600 mb-8">
          This is a demo of the chatbot widget. In production, only the floating widget will be visible.
        </p>
      </div>
      <ChatWidget />
    </div>
  </React.StrictMode>
);
