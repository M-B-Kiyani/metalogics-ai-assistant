const OpenAI = require('openai');
const fs = require('fs').promises;
const path = require('path');

class RAGService {
  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });
    this.knowledgeBase = [];
    this.embeddings = new Map();
    this.initialized = false;
  }

  async initialize() {
    try {
      await this.loadKnowledgeBase();
      this.initialized = true;
      console.log('✅ RAG Service initialized successfully');
    } catch (error) {
      console.error('❌ Failed to initialize RAG Service:', error);
      throw error;
    }
  }

  async loadKnowledgeBase() {
    try {
      const dataPath = path.join(__dirname, '../../data/knowledge_base.json');
      const data = await fs.readFile(dataPath, 'utf8');
      this.knowledgeBase = JSON.parse(data);
      
      // Load pre-computed embeddings if available
      const embeddingsPath = path.join(__dirname, '../../data/embeddings.json');
      try {
        const embeddingsData = await fs.readFile(embeddingsPath, 'utf8');
        const embeddingsArray = JSON.parse(embeddingsData);
        embeddingsArray.forEach(item => {
          this.embeddings.set(item.id, item.embedding);
        });
      } catch (err) {
        console.log('No pre-computed embeddings found, will generate on demand');
      }
    } catch (error) {
      console.log('Knowledge base not found, using default content');
      this.knowledgeBase = this.getDefaultKnowledgeBase();
    }
  }

  getDefaultKnowledgeBase() {
    return [
      {
        id: 'about-metalogics',
        title: 'About Metalogics',
        content: 'Metalogics is a leading technology company specializing in innovative software solutions, AI development, and digital transformation services. We help businesses leverage cutting-edge technology to achieve their goals.',
        category: 'company',
        url: 'https://metalogics.io/about'
      },
      {
        id: 'services-overview',
        title: 'Our Services',
        content: 'Metalogics offers comprehensive technology services including custom software development, AI and machine learning solutions, cloud infrastructure, mobile app development, and digital consulting services.',
        category: 'services',
        url: 'https://metalogics.io/services'
      },
      {
        id: 'contact-info',
        title: 'Contact Information',
        content: 'Contact Metalogics for inquiries about our services. We offer free consultations to discuss your technology needs and how we can help your business grow.',
        category: 'contact',
        url: 'https://metalogics.io/contact'
      }
    ];
  }

  async getEmbedding(text) {
    try {
      const response = await this.openai.embeddings.create({
        model: 'text-embedding-3-small',
        input: text,
      });
      return response.data[0].embedding;
    } catch (error) {
      console.error('Error generating embedding:', error);
      throw error;
    }
  }

  cosineSimilarity(a, b) {
    const dotProduct = a.reduce((sum, ai, i) => sum + ai * b[i], 0);
    const magnitudeA = Math.sqrt(a.reduce((sum, ai) => sum + ai * ai, 0));
    const magnitudeB = Math.sqrt(b.reduce((sum, bi) => sum + bi * bi, 0));
    return dotProduct / (magnitudeA * magnitudeB);
  }

  async findRelevantContent(query, topK = 3) {
    if (!this.initialized) {
      await this.initialize();
    }

    try {
      const queryEmbedding = await this.getEmbedding(query);
      const similarities = [];

      for (const item of this.knowledgeBase) {
        let itemEmbedding = this.embeddings.get(item.id);
        
        if (!itemEmbedding) {
          itemEmbedding = await this.getEmbedding(item.content);
          this.embeddings.set(item.id, itemEmbedding);
        }

        const similarity = this.cosineSimilarity(queryEmbedding, itemEmbedding);
        similarities.push({
          ...item,
          similarity
        });
      }

      return similarities
        .sort((a, b) => b.similarity - a.similarity)
        .slice(0, topK)
        .filter(item => item.similarity > 0.7); // Threshold for relevance
    } catch (error) {
      console.error('Error finding relevant content:', error);
      return [];
    }
  }

  async generateResponse(query, context = []) {
    try {
      const relevantContent = await this.findRelevantContent(query);
      
      const systemPrompt = `You are a helpful AI assistant for Metalogics, a technology company. 
      
      Your role:
      - Provide accurate information about Metalogics services and company
      - Help users understand how Metalogics can solve their technology needs
      - Guide conversations toward scheduling consultations or capturing leads
      - Be professional, warm, and trustworthy
      - If you don't know something, politely redirect to human support
      
      Company Information:
      ${relevantContent.map(item => `${item.title}: ${item.content}`).join('\n\n')}
      
      Guidelines:
      - Keep responses concise and helpful
      - Always offer to schedule a consultation for detailed discussions
      - Ask for contact information when appropriate
      - Suggest relevant services based on user needs`;

      const messages = [
        { role: 'system', content: systemPrompt },
        ...context,
        { role: 'user', content: query }
      ];

      const response = await this.openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: messages,
        max_tokens: 500,
        temperature: 0.7
      });

      return {
        response: response.choices[0].message.content,
        relevantContent: relevantContent,
        confidence: relevantContent.length > 0 ? 'high' : 'low'
      };
    } catch (error) {
      console.error('Error generating response:', error);
      return {
        response: "I apologize, but I'm experiencing technical difficulties. Please try again or contact our support team directly.",
        relevantContent: [],
        confidence: 'low'
      };
    }
  }
}

module.exports = new RAGService();
