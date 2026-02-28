import express from 'express';
import cors from 'cors';
import { createServer as createViteServer } from 'vite';
import Anthropic from '@anthropic-ai/sdk';
import { GoogleGenAI } from '@google/genai';
import * as cheerio from 'cheerio';

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Initialize AI Clients
const anthropic = new Anthropic({
  apiKey: process.env.CLAUDE_API_KEY,
});

const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Helper function to extract text from URL
async function fetchUrlContent(url: string): Promise<string> {
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });
    const html = await response.text();
    const $ = cheerio.load(html);
    
    // Remove scripts, styles, and other non-content elements
    $('script').remove();
    $('style').remove();
    $('nav').remove();
    $('footer').remove();
    
    // Extract text from body
    const text = $('body').text().replace(/\s+/g, ' ').trim();
    return text.substring(0, 5000); // Limit to 5000 chars to avoid token limits
  } catch (error) {
    console.error(`Error fetching URL ${url}:`, error);
    return '';
  }
}

// API Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.post('/api/chat', async (req, res) => {
  try {
    const { message, model = 'claude' } = req.body;
    
    // Extract URL from message if present (simple regex)
    const urlMatch = message.match(/https?:\/\/[^\s]+/);
    let enhancedMessage = message;
    
    if (urlMatch) {
      const url = urlMatch[0];
      console.log(`Fetching content for URL: ${url}`);
      const urlContent = await fetchUrlContent(url);
      if (urlContent) {
        enhancedMessage += `\n\n[System: The following content was extracted from the link: ${url}]\n${urlContent}\n[End of link content]`;
      }
    }

    if (model === 'claude' && process.env.CLAUDE_API_KEY) {
      try {
        const response = await anthropic.messages.create({
          model: "claude-3-5-sonnet-20240620",
          max_tokens: 1024,
          messages: [{ role: "user", content: enhancedMessage }],
        });

        // @ts-ignore
        const text = response.content[0].text;
        return res.json({ reply: text });
      } catch (e) {
        console.error('Claude API failed, falling back to Gemini', e);
        // Fallback to Gemini below
      }
    }

    // Gemini Handler
    // User explicitly provided this key. We prioritize it to debug the "Invalid Key" issue.
    const HARDCODED_KEY = "AIzaSyDw7qYOu5DvLiDhfaAeLazRRMgWKaLLNu8";
    let apiKey = HARDCODED_KEY; 
    
    if (!apiKey) {
       // Fallback to env vars if hardcoded key is removed
       apiKey = process.env.API_KEY || process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
    }
    
    if (!apiKey) {
      console.error("No API key found for Gemini");
      return res.status(500).json({ error: 'AI API keys not configured' });
    }

    apiKey = apiKey.trim();
    console.log(`Using API Key: ${apiKey.substring(0, 8)}...${apiKey.substring(apiKey.length - 4)}`);
    
    if (!apiKey.startsWith('AIza')) {
       console.warn("Warning: API Key does not start with 'AIza'. It might be invalid.");
    }
    
    // Re-initialize with the found key if needed, or rely on the global instance if it was init correctly.
    // Since we initialized genAI globally with process.env.GEMINI_API_KEY, we might need to create a new instance if that was undefined.
    const activeGenAI = new GoogleGenAI({ apiKey });

    const response = await activeGenAI.models.generateContent({
      model: "gemini-2.5-flash",
      contents: enhancedMessage,
      config: {
        systemInstruction: `Ты - опытный и конкретный турагент. Твоя цель - помочь клиенту выбрать и купить тур.
        
        Правила общения:
        1. Если клиент называет направление (например, "Мармарис"), НЕ пиши общие фразы "Ах, как там красиво!". Сразу переходи к делу.
        2. Если не знаешь бюджет, даты или состав туристов - ОБЯЗАТЕЛЬНО спроси это в первом же ответе.
        3. Когда предлагаешь варианты, давай конкретику: Название отеля, Звездность, Краткое описание (плюсы/минусы), Примерный бюджет.
        4. Предлагай обычно 3 варианта: Эконом, Средний, Люкс.
        5. Используй списки и форматирование для удобства чтения.
        6. Будь вежлив и позитивен (используй эмодзи), но не перегибай с "водой". Твоя задача - продать экспертность.`,
      }
    });
    
    res.json({ reply: response.text });

  } catch (error: any) {
    console.error('AI Error:', error);
    res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
});

// Vite middleware for development
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // In production, serve static files from dist
    const path = await import('path');
    const { fileURLToPath } = await import('url');
    const __dirname = path.dirname(fileURLToPath(import.meta.url));
    
    app.use(express.static(path.resolve(__dirname, 'dist')));
    
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
