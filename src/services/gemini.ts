import { GoogleGenAI } from "@google/genai";

let genAIClient: GoogleGenAI | null = null;

export const getGenAI = () => {
  if (!genAIClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is missing. Please add it to your environment variables.");
    }
    genAIClient = new GoogleGenAI({ apiKey });
  }
  return genAIClient;
};

export const generateTourPost = async (rawText: string, audience: string) => {
  const ai = getGenAI();
  const prompt = `Ты — топовый копирайтер для турагентств. Твоя задача: взять сухой технический текст от туроператора и превратить его в красивое, эмоциональное и продающее сообщение для отправки клиенту в WhatsApp.
  
  Целевая аудитория клиента: ${audience}. Адаптируй тон под них (например, для семей с детьми сделай акцент на детских клубах и питании, для молодежи — на тусовках и барах).
  
  Правила:
  1. Используй уместное количество эмодзи.
  2. Разбей текст на удобные абзацы.
  3. Выдели жирным шрифтом (используй Markdown **) название отеля, цену и даты.
  4. Добавь призыв к действию в конце (например, "Забронируем, пока есть места?").
  5. Убери весь технический мусор (коды рейсов, аббревиатуры туроператоров типа SPO, DBL, RO), переведи это на человеческий язык.

  Исходный текст от туроператора:
  ${rawText}`;
  
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
  });
  
  return response.text;
};

export const generateSmartNote = async (
  text?: string,
  audio?: { data: string; mimeType: string }
) => {
  const ai = getGenAI();
  const prompt = `Ты — AI-Структуризатор (Second Brain) для турагента.
Твоя задача: взять неструктурированный текст (поток сознания) или транскрибацию голоса и превратить его в:
1. Красивый Markdown с заголовками, списками и выделением жирным.
2. Summary (краткая выжимка).
3. Action Items (список дел/задач с чекбоксами).
4. Предложить 3-5 тегов.
5. Придумать 2-3 "связанные заметки" из прошлого (вымышленные, но релевантные контексту), чтобы показать фичу Second Brain.

Ответь СТРОГО в формате JSON:
{
  "markdown": "Здесь сгенерированный Markdown текст (включая Summary и Action Items)",
  "tags": ["тег1", "тег2"],
  "relatedNotes": [
    { "id": "1", "title": "Название старой заметки", "date": "12.10.2023" }
  ]
}`;

  let contents: any;
  if (audio) {
    contents = {
      parts: [
        { inlineData: { data: audio.data, mimeType: audio.mimeType } },
        { text: prompt }
      ]
    };
  } else if (text) {
    contents = prompt + "\n\nВходящий текст:\n" + text;
  } else {
    throw new Error("No input provided");
  }

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: contents,
    config: {
      responseMimeType: "application/json"
    }
  });

  if (!response.text) {
    throw new Error("No response from Gemini");
  }

  return JSON.parse(response.text);
};
