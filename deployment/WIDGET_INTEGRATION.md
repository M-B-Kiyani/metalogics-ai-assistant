# Widget Integration Guide for metalogics.io

## 🎯 Adding the AI Assistant to metalogics.io

### Method 1: Direct Script Integration (Recommended)

Add this script tag before the closing `</body>` tag on metalogics.io:

```html
<!-- Metalogics AI Assistant Widget -->
<script>
(function() {
  'use strict';
  
  // Widget configuration
  const WIDGET_CONFIG = {
    apiUrl: 'https://your-railway-backend.railway.app/api',
    position: 'bottom-right',
    theme: {
      primaryColor: '#2563eb',
      fontFamily: 'Inter, system-ui, sans-serif'
    }
  };

  // Check if widget already loaded
  if (window.MetalogicsWidget) return;

  // Create widget container
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
      
      .chat-window.open { display: flex; }
      
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

  // Load React widget
  const reactScript = document.createElement('script');
  reactScript.src = 'https://your-vercel-app.vercel.app/static/js/widget.js';
  reactScript.async = true;
  
  document.body.appendChild(widgetContainer);
  document.head.appendChild(reactScript);
  
  // Widget API
  window.MetalogicsWidget = {
    open: () => document.querySelector('.chat-window')?.classList.add('open'),
    close: () => document.querySelector('.chat-window')?.classList.remove('open'),
    toggle: () => document.querySelector('.chat-window')?.classList.toggle('open')
  };
})();
</script>
```

### Method 2: External Script File

1. **Host the widget script** on your CDN or server
2. **Add to metalogics.io**:

```html
<script src="https://cdn.metalogics.io/ai-assistant-widget.js" async></script>
```

### Method 3: WordPress Integration

For WordPress sites, add to `functions.php`:

```php
function add_metalogics_ai_widget() {
    ?>
    <script src="https://your-vercel-app.vercel.app/widget.js" async></script>
    <?php
}
add_action('wp_footer', 'add_metalogics_ai_widget');
```

## 🎨 Customization Options

### Theme Customization
```javascript
const WIDGET_CONFIG = {
  theme: {
    primaryColor: '#2563eb',        // Match metalogics.io brand
    fontFamily: 'Inter, sans-serif', // Match site typography
    borderRadius: '12px',           // Rounded corners
    shadow: '0 8px 32px rgba(0,0,0,0.12)' // Custom shadow
  }
};
```

### Position Options
```javascript
const WIDGET_CONFIG = {
  position: 'bottom-right', // bottom-left, top-right, top-left
  offset: {
    bottom: '20px',
    right: '20px'
  }
};
```

### Behavior Settings
```javascript
const WIDGET_CONFIG = {
  autoOpen: false,           // Auto-open on page load
  openDelay: 3000,          // Delay before auto-open (ms)
  showNotification: true,    // Show notification dot
  persistChat: true         // Remember chat state
};
```

## 📱 Mobile Optimization

The widget automatically adapts for mobile:
- **Desktop**: 380px × 600px floating window
- **Mobile**: Full-screen overlay (calc(100vw - 40px))
- **Tablet**: Responsive sizing based on viewport

## 🔧 Advanced Integration

### Custom Triggers
```javascript
// Open widget programmatically
document.querySelector('.contact-button').addEventListener('click', () => {
  MetalogicsWidget.open();
});

// Open widget on specific pages
if (window.location.pathname.includes('/contact')) {
  setTimeout(() => MetalogicsWidget.open(), 2000);
}
```

### Analytics Integration
```javascript
// Track widget interactions
window.MetalogicsWidget.onOpen = () => {
  gtag('event', 'chat_widget_opened', {
    event_category: 'engagement'
  });
};
```

## ✅ Integration Checklist

- [ ] Replace `your-railway-backend.railway.app` with actual Railway URL
- [ ] Replace `your-vercel-app.vercel.app` with actual Vercel URL
- [ ] Add script tag to metalogics.io before `</body>`
- [ ] Test widget functionality on desktop and mobile
- [ ] Verify chat responses and lead capture
- [ ] Test appointment scheduling flow
- [ ] Confirm email notifications work
- [ ] Check widget positioning and styling

## 🚨 Important Notes

1. **CORS Configuration**: Ensure metalogics.io domain is added to backend CORS settings
2. **SSL Certificate**: Both backend and frontend must use HTTPS in production
3. **Performance**: Widget loads asynchronously to not block page rendering
4. **Privacy**: Widget respects user privacy and GDPR compliance
5. **Fallback**: Graceful degradation if widget fails to load
