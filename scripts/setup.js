const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Setting up Metalogics AI Assistant...\n');

// Create data directory
const dataDir = path.join(__dirname, '../server/data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
  console.log('✅ Created data directory');
}

// Run scraper to populate knowledge base
console.log('🕷️ Running website scraper...');
try {
  const WebsiteScraper = require('../scraper/websiteScraper');
  const scraper = new WebsiteScraper();
  
  // Create fallback knowledge base
  scraper.createFallbackKnowledgeBase();
  scraper.saveKnowledgeBase();
  
  console.log('✅ Knowledge base created with fallback content');
} catch (error) {
  console.error('❌ Scraper error:', error.message);
  
  // Create minimal knowledge base
  const fallbackKB = [
    {
      id: 'company-info',
      title: 'About Metalogics',
      content: 'Metalogics is a leading technology company specializing in innovative software solutions, AI development, and digital transformation services.',
      category: 'company',
      url: 'https://metalogics.io/about'
    },
    {
      id: 'services-info',
      title: 'Our Services',
      content: 'We offer custom software development, AI solutions, cloud infrastructure, mobile apps, and digital consulting.',
      category: 'services',
      url: 'https://metalogics.io/services'
    }
  ];
  
  fs.writeFileSync(
    path.join(dataDir, 'knowledge_base.json'),
    JSON.stringify(fallbackKB, null, 2)
  );
  console.log('✅ Created minimal knowledge base');
}

console.log('\n🎉 Setup complete! Next steps:');
console.log('1. Copy .env.example to .env and configure your API keys');
console.log('2. Set up PostgreSQL database');
console.log('3. Run: npm run dev');
console.log('\nFor production deployment, see deployment/ directory');
