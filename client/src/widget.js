// Standalone widget script for embedding in metalogics.io
(function() {
  'use strict';

  // Configuration
  const WIDGET_CONFIG = {
    apiUrl: 'https://your-backend-url.com/api', // Replace with actual backend URL
    position: 'bottom-right',
    theme: {
      primaryColor: '#2563eb',
      fontFamily: 'Inter, system-ui, sans-serif'
    }
  };

  // Check if widget is already loaded
  if (window.MetalogicsWidget) {
    return;
  }

  // Create widget container
  function createWidget() {
    const widgetContainer = document.createElement('div');
    widgetContainer.id = 'metalogics-chat-widget';
    widgetContainer.innerHTML = `
      <div id="chat-widget-root"></div>
      <style>
        #metalogics-chat-widget {
          position: fixed;
          bottom: 20px;
          right: 20px;
          z-index: 9999;
          font-family: ${WIDGET_CONFIG.theme.fontFamily};
        }
        
        .widget-button {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background: ${WIDGET_CONFIG.theme.primaryColor};
          border: none;
          cursor: pointer;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
        }
        
        .widget-button:hover {
          transform: scale(1.05);
          box-shadow: 0 6px 16px rgba(0,0,0,0.2);
        }
        
        .widget-button svg {
          width: 24px;
          height: 24px;
          fill: white;
        }
        
        .chat-window {
          position: absolute;
          bottom: 80px;
          right: 0;
          width: 380px;
          height: 600px;
          background: white;
          border-radius: 12px;
          box-shadow: 0 8px 32px rgba(0,0,0,0.12);
          border: 1px solid #e5e7eb;
          display: none;
          flex-direction: column;
          overflow: hidden;
        }
        
        .chat-window.open {
          display: flex;
        }
        
        @media (max-width: 480px) {
          .chat-window {
            width: calc(100vw - 40px);
            height: calc(100vh - 120px);
            bottom: 80px;
            right: 20px;
          }
        }
      </style>
    `;

    document.body.appendChild(widgetContainer);
    return widgetContainer;
  }

  // Initialize widget
  function initWidget() {
    const container = createWidget();
    const chatRoot = container.querySelector('#chat-widget-root');
    
    // Create toggle button
    const toggleButton = document.createElement('button');
    toggleButton.className = 'widget-button';
    toggleButton.innerHTML = `
      <svg viewBox="0 0 24 24">
        <path d="M20 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h4l4 4 4-4h4c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/>
      </svg>
    `;
    
    // Create chat window
    const chatWindow = document.createElement('div');
    chatWindow.className = 'chat-window';
    chatWindow.innerHTML = `
      <div style="padding: 20px; text-align: center; color: #666;">
        <h3 style="margin: 0 0 10px 0; color: ${WIDGET_CONFIG.theme.primaryColor};">Metalogics Assistant</h3>
        <p style="margin: 0; font-size: 14px;">Loading chat interface...</p>
      </div>
    `;
    
    // Toggle functionality
    let isOpen = false;
    toggleButton.addEventListener('click', () => {
      isOpen = !isOpen;
      chatWindow.classList.toggle('open', isOpen);
      
      if (isOpen && !window.MetalogicsWidgetLoaded) {
        loadChatInterface(chatWindow);
      }
    });
    
    chatRoot.appendChild(toggleButton);
    chatRoot.appendChild(chatWindow);
  }

  // Load full chat interface
  function loadChatInterface(container) {
    // In a real implementation, this would load the React components
    // For now, we'll create a simple chat interface
    container.innerHTML = `
      <div style="background: ${WIDGET_CONFIG.theme.primaryColor}; color: white; padding: 16px; display: flex; justify-content: space-between; align-items: center;">
        <div>
          <div style="font-weight: 600; font-size: 14px;">Metalogics Assistant</div>
          <div style="font-size: 12px; opacity: 0.8;">Online</div>
        </div>
        <button onclick="this.closest('.chat-window').classList.remove('open')" style="background: none; border: none; color: white; cursor: pointer; padding: 4px;">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
          </svg>
        </button>
      </div>
      <div style="flex: 1; padding: 16px; overflow-y: auto; display: flex; flex-direction: column; gap: 12px;">
        <div style="background: #f3f4f6; padding: 12px; border-radius: 12px; border-bottom-left-radius: 4px; max-width: 80%;">
          Hello! I'm the Metalogics AI Assistant. I'm here to help you learn about our services and answer any questions you might have. How can I assist you today?
        </div>
      </div>
      <div style="padding: 16px; border-top: 1px solid #e5e7eb;">
        <div style="display: flex; gap: 8px;">
          <input type="text" placeholder="Type your message..." style="flex: 1; padding: 12px; border: 1px solid #d1d5db; border-radius: 24px; outline: none; font-size: 14px;">
          <button style="background: ${WIDGET_CONFIG.theme.primaryColor}; color: white; border: none; border-radius: 50%; width: 40px; height: 40px; cursor: pointer; display: flex; align-items: center; justify-content: center;">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
            </svg>
          </button>
        </div>
      </div>
    `;
    
    window.MetalogicsWidgetLoaded = true;
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initWidget);
  } else {
    initWidget();
  }

  // Expose widget API
  window.MetalogicsWidget = {
    open: function() {
      const chatWindow = document.querySelector('.chat-window');
      if (chatWindow) {
        chatWindow.classList.add('open');
      }
    },
    close: function() {
      const chatWindow = document.querySelector('.chat-window');
      if (chatWindow) {
        chatWindow.classList.remove('open');
      }
    },
    toggle: function() {
      const chatWindow = document.querySelector('.chat-window');
      if (chatWindow) {
        chatWindow.classList.toggle('open');
      }
    }
  };

})();
