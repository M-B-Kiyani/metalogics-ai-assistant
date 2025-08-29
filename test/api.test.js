const axios = require('axios');

// Simple API test script
const API_BASE = 'http://localhost:3001/api';

async function testAPI() {
  console.log('🧪 Testing Metalogics AI Assistant API...\n');

  try {
    // Test health endpoint
    console.log('1. Testing health endpoint...');
    const health = await axios.get(`${API_BASE}/health`);
    console.log('✅ Health check:', health.data.status);

    // Test chat initialization
    console.log('\n2. Testing chat initialization...');
    const initResponse = await axios.post(`${API_BASE}/chat/init`);
    const sessionId = initResponse.data.sessionId;
    console.log('✅ Chat initialized:', sessionId);

    // Test sending a message
    console.log('\n3. Testing message sending...');
    const messageResponse = await axios.post(`${API_BASE}/chat/message`, {
      message: 'What services does Metalogics offer?',
      sessionId: sessionId
    });
    console.log('✅ Message response:', messageResponse.data.response.substring(0, 100) + '...');

    // Test lead capture
    console.log('\n4. Testing lead capture...');
    const leadResponse = await axios.post(`${API_BASE}/leads`, {
      name: 'Test User',
      email: 'test@example.com',
      company: 'Test Company',
      message: 'Interested in AI solutions',
      sessionId: sessionId
    });
    console.log('✅ Lead captured:', leadResponse.data.leadId);

    console.log('\n🎉 All tests passed!');

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
    console.log('\n💡 Make sure the server is running: npm run server:dev');
  }
}

// Run tests if called directly
if (require.main === module) {
  testAPI();
}

module.exports = { testAPI };
