const BOT_TOKEN = "8519693459:AAGZYbV6aEQbNLz8v-xVWZH_48N5Sr3XWjY";
const CHAT_ID = "1372666245";

export const sendTelegramNotification = async (message: string) => {
  const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text: message,
        parse_mode: 'HTML'
      })
    });
    return response.ok;
  } catch (error) {
    console.error("Telegram error:", error);
    return false;
  }
};
