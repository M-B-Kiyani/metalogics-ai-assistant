import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

class ApiService {
  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
        return config;
      },
      (error) => {
        console.error('API Request Error:', error);
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response) => {
        return response.data;
      },
      (error) => {
        console.error('API Response Error:', error);
        
        if (error.response?.status === 429) {
          throw new Error('Too many requests. Please try again later.');
        }
        
        if (error.response?.status >= 500) {
          throw new Error('Server error. Please try again later.');
        }
        
        throw new Error(error.response?.data?.error || 'Network error occurred');
      }
    );
  }

  // Chat endpoints
  async initChat() {
    return this.client.post('/chat/init');
  }

  async sendMessage(message, sessionId, context = []) {
    return this.client.post('/chat/message', {
      message,
      sessionId,
      context
    });
  }

  async getChatHistory(sessionId) {
    return this.client.get(`/chat/history/${sessionId}`);
  }

  async endChat(sessionId) {
    return this.client.post(`/chat/end/${sessionId}`);
  }

  // Lead endpoints
  async captureLead(leadData) {
    return this.client.post('/leads', leadData);
  }

  async scheduleAppointment(leadId, appointmentData) {
    return this.client.post(`/leads/${leadId}/appointment`, appointmentData);
  }

  // Health check
  async healthCheck() {
    return this.client.get('/health');
  }
}

export default new ApiService();
