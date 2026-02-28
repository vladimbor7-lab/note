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
    const { message, task = 'chat' } = req.body;
    
    // Gemini Handler
    let apiKey = process.env.API_KEY || process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
    
    if (!apiKey) {
      console.error("No API key found for Gemini");
      return res.status(500).json({ error: 'AI API keys not configured' });
    }

    apiKey = apiKey.trim();
    
    const activeGenAI = new GoogleGenAI({ apiKey });

    let systemInstruction = "";
    let prompt = message;

    if (task === 'structure') {
        systemInstruction = `Ты - профессиональный редактор и структуризатор текста. 
        Твоя задача: превратить "поток сознания" пользователя в четко структурированный Markdown.
        
        Правила:
        1. Используй заголовки (##, ###) для разделения тем.
        2. Используй маркированные списки (-) для перечислений.
        3. Выделяй ключевые мысли **жирным**.
        4. Если есть задачи, оформляй их как чек-листы (- [ ]).
        5. Не меняй смысл, но исправляй ошибки и улучшай читаемость.
        6. Не пиши вступлений ("Вот ваш текст..."), сразу выдавай результат.`;
    } else if (task === 'tags') {
        systemInstruction = `Ты - AI-библиотекарь. Твоя задача - проанализировать текст и предложить 3-5 релевантных тегов.
        Ответ должен быть ТОЛЬКО в формате JSON массива строк, например: ["#идеи", "#работа", "#проект"].
        Без лишних слов.`;
    } else if (task === 'summary') {
        systemInstruction = `Ты - личный ассистент. Твоя задача - написать краткое резюме (summary) текста (максимум 3 предложения) и выделить основные Action Items (если есть).`;
    } else {
        // Default chat mode (Second Brain Assistant)
        systemInstruction = `Ты - умный помощник "Second Brain". Твоя задача - помогать пользователю развивать мысли, находить связи и структурировать информацию. Будь краток и полезен.`;
    }

    const response = await activeGenAI.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        systemInstruction: systemInstruction,
      }
    });
    
    const responseText = response.text;
    // console.log("AI Response:", responseText.substring(0, 50) + "...");

    res.json({ reply: responseText });

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
