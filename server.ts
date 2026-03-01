import express from 'express';
import cors from 'cors';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from "@google/genai";
import * as cheerio from 'cheerio';

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Initialize AI Clients
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

    const systemInstruction = `Ты - ведущий эксперт-турагент сервиса Travel AI, интегрированного с базой данных otpravkin.ru. 
Ваша главная задача: предоставлять пользователям ТОЛЬКО РЕАЛЬНЫЕ цены и ПРЯМЫЕ ссылки на туры с сайта otpravkin.ru.

ПРАВИЛА РАБОТЫ:
1. ИНФОРМАЦИЯ: Ты должен стремиться предоставлять актуальную стоимость и наличие. Опирайся на данные с сайта otpravkin.ru.
2. ЦЕНЫ: Всегда указывай стоимость тура (например, "от 145 000 руб. на двоих"). Никогда не выдумывай цены, если не уверен - говори "уточняйте на сайте".
3. ССЫЛКИ: Для каждого упомянутого отеля ты ОБЯЗАН предоставить прямую ссылку на страницу этого отеля на сайте otpravkin.ru (формат: https://otpravkin.ru/hotels/название-отеля).
4. СТИЛЬ: Общайся как живой человек, профессионально, но с энтузиазмом. Используй эмодзи.
5. КОНТЕКСТ: Если пользователь прислал ссылку на otpravkin.ru, изучи её содержимое (оно передано тебе в тексте) и прокомментируй конкретные отели.

Твоя цель - сделать так, чтобы клиент мог сразу перейти по ссылке и забронировать тур по указанной тобой цене.`;

    // Use Gemini
    console.log(`Using Google Gemini (Flash) for chat`);
    
    try {
      const response = await genAI.models.generateContent({
        model: "gemini-1.5-flash-latest",
        contents: enhancedMessage,
        config: {
          systemInstruction: systemInstruction,
          temperature: 0.7,
          maxOutputTokens: 2048,
        },
      });

      const text = response.text || '';
      return res.json({ reply: text });
    } catch (e: any) {
      console.error('Gemini API Error:', e.message);
      return res.status(500).json({ 
        error: `AI Error: Gemini failed (${e.message}).` 
      });
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
