const puppeteer = require('puppeteer');
const cheerio = require('cheerio');
const fs = require('fs').promises;
const path = require('path');

class WebsiteScraper {
  constructor() {
    this.baseUrl = 'https://metalogics.io';
    this.knowledgeBase = [];
  }

  async scrapeWebsite() {
    console.log('🕷️ Starting website scraping...');
    
    try {
      const browser = await puppeteer.launch({ 
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      });
      
      const page = await browser.newPage();
      await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36');
      
      // Define pages to scrape
      const pagesToScrape = [
        { url: '/', title: 'Home', category: 'general' },
        { url: '/about', title: 'About Us', category: 'company' },
        { url: '/services', title: 'Services', category: 'services' },
        { url: '/portfolio', title: 'Portfolio', category: 'portfolio' },
        { url: '/contact', title: 'Contact', category: 'contact' }
      ];

      for (const pageInfo of pagesToScrape) {
        try {
          console.log(`Scraping: ${this.baseUrl}${pageInfo.url}`);
          await this.scrapePage(page, pageInfo);
          await this.delay(2000); // Be respectful with delays
        } catch (error) {
          console.error(`Error scraping ${pageInfo.url}:`, error.message);
          // Add fallback content for failed pages
          this.addFallbackContent(pageInfo);
        }
      }

      await browser.close();
      
      // Save knowledge base
      await this.saveKnowledgeBase();
      console.log('✅ Website scraping completed');
      
    } catch (error) {
      console.error('❌ Scraping failed:', error);
      // Use fallback content if scraping fails
      this.createFallbackKnowledgeBase();
      await this.saveKnowledgeBase();
    }
  }

  async scrapePage(page, pageInfo) {
    const fullUrl = `${this.baseUrl}${pageInfo.url}`;
    
    try {
      await page.goto(fullUrl, { waitUntil: 'networkidle2', timeout: 30000 });
      
      const content = await page.evaluate(() => {
        // Remove script and style elements
        const scripts = document.querySelectorAll('script, style, nav, footer, .cookie-banner');
        scripts.forEach(el => el.remove());
        
        // Get main content
        const main = document.querySelector('main') || document.querySelector('.main-content') || document.body;
        return main ? main.innerText : document.body.innerText;
      });

      // Clean and process content
      const cleanContent = this.cleanContent(content);
      
      if (cleanContent.length > 100) {
        this.knowledgeBase.push({
          id: `${pageInfo.category}-${pageInfo.url.replace(/\//g, '-') || 'home'}`,
          title: pageInfo.title,
          content: cleanContent,
          category: pageInfo.category,
          url: fullUrl,
          scraped_at: new Date().toISOString()
        });
      }
      
    } catch (error) {
      throw new Error(`Failed to scrape ${fullUrl}: ${error.message}`);
    }
  }

  cleanContent(content) {
    return content
      .replace(/\s+/g, ' ') // Replace multiple spaces with single space
      .replace(/\n+/g, ' ') // Replace newlines with spaces
      .replace(/[^\w\s.,!?;:()\-]/g, '') // Remove special characters except basic punctuation
      .trim()
      .substring(0, 2000); // Limit content length
  }

  addFallbackContent(pageInfo) {
    const fallbackContent = this.getFallbackContent(pageInfo.category);
    if (fallbackContent) {
      this.knowledgeBase.push({
        id: `${pageInfo.category}-fallback`,
        title: pageInfo.title,
        content: fallbackContent,
        category: pageInfo.category,
        url: `${this.baseUrl}${pageInfo.url}`,
        scraped_at: new Date().toISOString(),
        fallback: true
      });
    }
  }

  getFallbackContent(category) {
    const fallbacks = {
      general: 'Metalogics is a leading technology company specializing in innovative software solutions, AI development, and digital transformation services. We help businesses leverage cutting-edge technology to achieve their goals and stay competitive in the digital age.',
      
      company: 'Metalogics was founded with the vision of bridging the gap between complex technology and business success. Our team of experienced developers, AI specialists, and digital strategists work together to deliver solutions that drive real business value. We believe in the power of technology to transform industries and create new opportunities.',
      
      services: 'Metalogics offers comprehensive technology services including: Custom Software Development - tailored applications built to your specifications; AI and Machine Learning Solutions - intelligent systems that learn and adapt; Cloud Infrastructure - scalable and secure cloud deployments; Mobile App Development - native and cross-platform mobile applications; Digital Consulting - strategic guidance for digital transformation; DevOps and Automation - streamlined development and deployment processes.',
      
      portfolio: 'Metalogics has successfully delivered projects across various industries including healthcare, finance, e-commerce, and manufacturing. Our portfolio showcases innovative solutions that have helped businesses increase efficiency, reduce costs, and improve customer experiences. From AI-powered analytics platforms to enterprise-grade web applications, we have the expertise to handle projects of any scale.',
      
      contact: 'Ready to transform your business with cutting-edge technology? Contact Metalogics today to schedule a free consultation. Our team is ready to discuss your project requirements and provide tailored solutions that meet your specific needs. We offer flexible engagement models and competitive pricing to ensure the best value for your investment.'
    };
    
    return fallbacks[category] || null;
  }

  createFallbackKnowledgeBase() {
    console.log('Creating fallback knowledge base...');
    
    const categories = ['general', 'company', 'services', 'portfolio', 'contact'];
    categories.forEach(category => {
      const content = this.getFallbackContent(category);
      if (content) {
        this.knowledgeBase.push({
          id: `${category}-fallback`,
          title: category.charAt(0).toUpperCase() + category.slice(1),
          content: content,
          category: category,
          url: `${this.baseUrl}/${category === 'general' ? '' : category}`,
          scraped_at: new Date().toISOString(),
          fallback: true
        });
      }
    });
  }

  async saveKnowledgeBase() {
    try {
      const dataDir = path.join(__dirname, '../server/data');
      await fs.mkdir(dataDir, { recursive: true });
      
      const filePath = path.join(dataDir, 'knowledge_base.json');
      await fs.writeFile(filePath, JSON.stringify(this.knowledgeBase, null, 2));
      
      console.log(`💾 Knowledge base saved: ${this.knowledgeBase.length} entries`);
      console.log(`📁 File location: ${filePath}`);
      
    } catch (error) {
      console.error('Error saving knowledge base:', error);
    }
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Run scraper if called directly
if (require.main === module) {
  const scraper = new WebsiteScraper();
  scraper.scrapeWebsite().catch(console.error);
}

module.exports = WebsiteScraper;
