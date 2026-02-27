require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');

// Этот файл предназначен для деплоя на отдельный сервер (например, Render, Vercel Serverless, Heroku)
// Он отвечает за прием сообщений от клиентов и квалификацию лидов.

const token = process.env.BOT_TOKEN || "8519693459:AAGZYbV6aEQbNLz8v-xVWZH_48N5Sr3XWjY";
const bot = new TelegramBot(token, { polling: true });

// Простая база данных в памяти (для продакшена используйте MongoDB или PostgreSQL)
const userState = {};

bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  userState[chatId] = { step: 1 };
  bot.sendMessage(chatId, "Здравствуйте! Я ИИ-ассистент турагентства. Помогу подобрать идеальный тур. Подскажите, в какую страну вы планируете полететь?");
});

bot.on('message', (msg) => {
  const chatId = msg.chat.id;
  if (msg.text === '/start') return;

  const state = userState[chatId] || { step: 1 };

  if (state.step === 1) {
    state.country = msg.text;
    state.step = 2;
    bot.sendMessage(chatId, "Отличный выбор! А в какие даты планируете отпуск и на сколько дней?");
  } else if (state.step === 2) {
    state.dates = msg.text;
    state.step = 3;
    bot.sendMessage(chatId, "Понял. Подскажите состав туристов (сколько взрослых и детей)?");
  } else if (state.step === 3) {
    state.tourists = msg.text;
    state.step = 4;
    bot.sendMessage(chatId, "И последний вопрос: какой у вас примерный бюджет на поездку?");
  } else if (state.step === 4) {
    state.budget = msg.text;
    state.step = 5;
    bot.sendMessage(chatId, "Спасибо! Я передал всю информацию менеджеру. Он скоро свяжется с вами с готовой подборкой туров! 🌴");
    
    // Отправляем уведомление менеджеру (Вам)
    const AGENT_CHAT_ID = "1372666245";
    const leadMsg = `🚨 <b>Новая заявка (Квалифицирована ботом)!</b>\n\n🌍 Направление: ${state.country}\n📅 Даты: ${state.dates}\n👥 Состав: ${state.tourists}\n💰 Бюджет: ${state.budget}\n👤 Клиент: @${msg.from.username || msg.from.first_name}`;
    
    bot.sendMessage(AGENT_CHAT_ID, leadMsg, { parse_mode: 'HTML' });
  }
});

console.log("Telegram Bot Server is running...");
