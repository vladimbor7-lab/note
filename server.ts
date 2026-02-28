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
    const response = await fetch(url);
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

    if (model === 'claude') {
      if (!process.env.CLAUDE_API_KEY) {
        return res.status(500).json({ error: 'Claude API key not configured' });
      }

      const response = await anthropic.messages.create({
        model: "claude-3-5-sonnet-20240620",
        max_tokens: 1024,
        messages: [{ role: "user", content: enhancedMessage }],
      });

      // @ts-ignore - content[0] is TextBlock
      res.json({ reply: response.content[0].text });
    } else {
      // Fallback to Gemini
      if (!process.env.GEMINI_API_KEY) {
        return res.status(500).json({ error: 'Gemini API key not configured' });
      }
      
      const response = await genAI.models.generateContent({
        model: "gemini-2.0-flash-exp",
        contents: enhancedMessage
      });
      
      res.json({ reply: response.text });
    }
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
