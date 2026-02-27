import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import TelegramBot from "node-telegram-bot-api";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// In-memory leads store
let leads: any[] = [
  { 
    id: Date.now(), 
    name: 'Алексей (Тест)', 
    destination: 'Турция', 
    budget: '250 000 ₽', 
    people: '2 взрослых, 1 ребенок', 
    dates: 'Середина августа', 
    status: 'Новая', 
    raw: 'Хотим в Турцию в августе с ребенком, бюджет 250к' 
  }
];

const BOT_TOKEN = process.env.BOT_TOKEN || "8340829703:AAGI47Ma3B5DJjV1N0CiB2ELaavBp8g9OZU";
const AGENT_CHAT_ID = process.env.TELEGRAM_CHAT_ID || "1372666245";

// Initialize Bot
let bot: TelegramBot | null = null;
try {
  bot = new TelegramBot(BOT_TOKEN, { polling: true });
  console.log("Telegram bot started polling");

  bot.on('message', async (msg) => {
    const chatId = msg.chat.id;
    const text = msg.text || '';

    if (text === '/start') {
      bot?.sendMessage(chatId, 'Здравствуйте! Я ИИ-ассистент турагентства. Напишите, куда бы вы хотели полететь, состав вашей семьи и примерный бюджет, и я передам заявку нашему лучшему менеджеру!');
      return;
    }

    bot?.sendChatAction(chatId, 'typing');

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });
      const prompt = `
        Extract travel parameters from this message: "${text}". 
        Return ONLY a valid JSON object with keys: "destination", "budget", "people", "dates". 
        If a parameter is missing or unknown, set its value to "Не указано".
        Do not include markdown formatting like \`\`\`json. Just the raw JSON object.
      `;
      
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
      });
      
      let jsonText = response.text || "{}";
      jsonText = jsonText.replace(/```json/g, '').replace(/```/g, '').trim();
      
      const data = JSON.parse(jsonText);

      const newLead = {
        id: Date.now(),
        name: msg.from?.first_name || msg.from?.username || 'Клиент TG',
        destination: data.destination || 'Не указано',
        budget: data.budget || 'Не указано',
        people: data.people || 'Не указано',
        dates: data.dates || 'Не указано',
        status: 'Новая',
        raw: text
      };
      
      leads.unshift(newLead);

      const notification = `🚨 *Новая квалифицированная заявка!*\n\n👤 *Клиент:* ${newLead.name}\n📍 *Направление:* ${newLead.destination}\n💰 *Бюджет:* ${newLead.budget}\n👨‍👩‍👧 *Состав:* ${newLead.people}\n📅 *Даты:* ${newLead.dates}\n\n💬 *Оригинал:* _${newLead.raw}_`;
      
      bot?.sendMessage(AGENT_CHAT_ID, notification, { parse_mode: 'Markdown' });
      bot?.sendMessage(chatId, 'Спасибо! Я собрал информацию и передал её менеджеру. Он скоро свяжется с вами с готовой подборкой туров.');
    } catch (e) {
      console.error("Error processing message:", e);
      bot?.sendMessage(chatId, 'Спасибо за обращение! Передал вашу заявку менеджеру.');
    }
  });

  bot.on('polling_error', (error) => {
    console.error("Polling error:", error.message);
  });

  process.once('SIGINT', () => bot?.stopPolling());
  process.once('SIGTERM', () => bot?.stopPolling());
} catch (e) {
  console.error("Failed to start Telegram bot:", e);
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  app.get("/api/leads", (req, res) => {
    res.json(leads);
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Production static serving
    app.use(express.static(path.resolve(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.resolve(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
