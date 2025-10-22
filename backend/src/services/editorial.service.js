const axios = require('axios');
const cheerio = require('cheerio');
const { ChatOpenAI } = require("@langchain/openai");
const { HumanMessage, SystemMessage } = require("@langchain/core/messages");

class EditorialService {
  constructor() {
    this.llm = new ChatOpenAI({
      openAIApiKey: process.env.OPENAI_API_KEY,
      temperature: 0.7,
      modelName: "gpt-3.5-turbo"
    });
    
    // Common CSS selectors for different newspapers
    this.newspaperSelectors = {
      'thehindu.com': [
        'article .story-content',
        'article .article-content',
        'article .content-body',
        'article'
      ],
      'indianexpress.com': [
        '.story-details',
        '.article-content',
        '.full-details',
        'article'
      ],
      'timesofindia.indiatimes.com': [
        '.article-content',
        '.story-content',
        '.normal',
        'article'
      ],
      'economictimes.indiatimes.com': [
        '.article-content',
        '.story-section',
        'article'
      ]
    };
  }

  async extractEditorialContent(url) {
    try {
      console.log(`Extracting editorial from: ${url}`);
      
      // Validate URL
      const urlObj = new URL(url);
      const domain = urlObj.hostname;
      
      // Add headers to avoid blocking
      const response = await axios.get(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.5',
          'Connection': 'keep-alive',
        },
        timeout: 30000
      });

      const $ = cheerio.load(response.data);
      
      // Try different selectors based on domain
      const selectors = this.getSelectorsForDomain(domain);
      let content = '';

      for (const selector of selectors) {
        const elements = $(selector);
        if (elements.length > 0) {
          content = elements.text();
          if (content.length > 500) { // Ensure we have substantial content
            console.log(`Found content using selector: ${selector}`);
            break;
          }
        }
      }

      // If no content found with specific selectors, try to get any article-like content
      if (!content || content.length < 500) {
        console.log('Trying fallback content extraction...');
        content = this.fallbackContentExtraction($);
      }

      const cleanedContent = this.cleanText(content);

      if (cleanedContent.length < 300) {
        throw new Error('Extracted content is too short. Please check if the URL points to a valid editorial article.');
      }

      return {
        success: true,
        editorial: cleanedContent,
        wordCount: cleanedContent.split(/\s+/).length,
        characterCount: cleanedContent.length,
        source: domain
      };
    } catch (error) {
      console.error('Error extracting editorial:', error.message);
      throw new Error(`Failed to extract editorial: ${error.message}`);
    }
  }

  getSelectorsForDomain(domain) {
    for (const [key, selectors] of Object.entries(this.newspaperSelectors)) {
      if (domain.includes(key)) {
        return selectors;
      }
    }
    // Default selectors if domain not recognized
    return [
      'article',
      '.story-content',
      '.article-content',
      '.content-body',
      '.post-content',
      '.entry-content'
    ];
  }

  fallbackContentExtraction($) {
    // Remove unwanted elements
    $('script, style, nav, header, footer, .ad, .advertisement, .social-share').remove();
    
    // Try to get the main content by looking for the largest text block
    const paragraphs = $('p').map((i, el) => $(el).text()).get();
    const content = paragraphs
      .filter(p => p.length > 50) // Filter out short paragraphs
      .join(' ')
      .trim();

    return content || $('body').text();
  }

  async generateUPSCQuestions(editorialText) {
    const systemPrompt = `You are an expert UPSC examiner with 20 years of experience. Generate 3 high-quality mains exam questions based on the editorial content.

Requirements for each question:
1. Must be analytical and require critical thinking
2. Should cover different aspects (social, economic, political, international relations, governance)
3. Must follow UPSC GS mains exam pattern
4. Should be specific and answerable in 250-300 words
5. Include the question type (GS1, GS2, GS3, GS4) based on subject matter

Format the response as valid JSON:
{
  "questions": [
    {
      "question": "full question text here",
      "type": "GS1/GS2/GS3/GS4",
      "theme": "main theme/topic",
      "keywords": ["keyword1", "keyword2", "keyword3"]
    }
  ]
}

Ensure the questions are diverse and cover different dimensions of the editorial.`;

    try {
      const response = await this.llm.invoke([
        new SystemMessage(systemPrompt),
        new HumanMessage(`Editorial content: ${editorialText.substring(0, 3500)}`)
      ]);

      // Parse and validate the response
      let questionsData;
      try {
        questionsData = JSON.parse(response.content);
      } catch (parseError) {
        console.error('Failed to parse LLM response as JSON:', response.content);
        throw new Error('Failed to generate valid questions format');
      }

      // Validate the questions structure
      if (!questionsData.questions || !Array.isArray(questionsData.questions)) {
        throw new Error('Invalid questions format generated');
      }

      return {
        success: true,
        ...questionsData,
        generatedAt: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error generating questions:', error.message);
      throw new Error(`Failed to generate questions: ${error.message}`);
    }
  }

  async generateModelAnswer(question, editorialContext) {
    const systemPrompt = `You are a UPSC topper with exceptional answer writing skills. Write a model answer that demonstrates:

STRUCTURE REQUIREMENTS:
1. INTRODUCTION: 2-3 sentences setting context and stating your thesis
2. BODY: 4-5 paragraphs with different perspectives, facts, and analysis
3. CONCLUSION: 2-3 sentences with balanced viewpoint and way forward

CONTENT REQUIREMENTS:
- Word limit: 250-300 words
- Include relevant data, constitutional provisions, committee recommendations
- Maintain balanced viewpoint with multiple perspectives
- Use clear paragraph breaks and logical flow
- Include contemporary examples where applicable

Format the answer with proper paragraphs and ensure it's well-structured.`;

    try {
      const response = await this.llm.invoke([
        new SystemMessage(systemPrompt),
        new HumanMessage(`QUESTION: ${question}\n\nEDITORIAL CONTEXT: ${editorialContext.substring(0, 2000)}`)
      ]);

      return {
        success: true,
        answer: response.content,
        question: question,
        generatedAt: new Date().toISOString(),
        estimatedWords: response.content.split(/\s+/).length
      };
    } catch (error) {
      console.error('Error generating answer:', error.message);
      throw new Error(`Failed to generate answer: ${error.message}`);
    }
  }

  cleanText(text) {
    return text
      .replace(/\s+/g, ' ')
      .replace(/\n/g, ' ')
      .replace(/\t/g, ' ')
      .replace(/[^\w\s.,!?;:()\-]/g, '')
      .replace(/\s+\./g, '.')
      .replace(/\s+,/g, ',')
      .trim()
      .substring(0, 4000);
  }
}

module.exports = new EditorialService();